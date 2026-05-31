#include "SpotifyAuth.h"

#include <curl/curl.h>
#include <json/json.h>

#include <cstdlib>
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>

SpotifyAuth::SpotifyAuth(std::string project_id) : project_(std::move(project_id)) {}

// ── Utilities ────────────────────────────────────────────────────────────────

static size_t writeToString(void* ptr, size_t size, size_t nmemb, void* userdata) {
  std::string* s = static_cast<std::string*>(userdata);
  s->append(static_cast<char*>(ptr), size * nmemb);
  return size * nmemb;
}

static std::string base64Encode(const std::string& in) {
  static const char* b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  std::string out;
  int val = 0, valb = -6;
  for (unsigned char c : in) {
    val = (val << 8) + c;
    valb += 8;
    while (valb >= 0) { out.push_back(b64[(val >> valb) & 0x3F]); valb -= 6; }
  }
  if (valb > -6) out.push_back(b64[((val << 8) >> (valb + 8)) & 0x3F]);
  while (out.size() % 4) out.push_back('=');
  return out;
}

static std::string base64Decode(const std::string& in) {
  static const std::string chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  std::string out;
  int val = 0, valb = -8;
  for (unsigned char c : in) {
    if (c == '=') break;
    auto pos = chars.find(c);
    if (pos == std::string::npos) continue;
    val = (val << 6) + static_cast<int>(pos);
    valb += 6;
    if (valb >= 0) { out.push_back(static_cast<char>((val >> valb) & 0xFF)); valb -= 8; }
  }
  return out;
}

// Minimal HTTP GET. Returns body on HTTP 2xx, empty string on any failure.
static std::string httpGet(const std::string& url,
                            const std::vector<std::string>& headers,
                            long timeout_sec = 10) {
  CURL* curl = curl_easy_init();
  if (!curl) return "";

  std::string body;
  struct curl_slist* hdrs = nullptr;
  for (const auto& h : headers) hdrs = curl_slist_append(hdrs, h.c_str());

  curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
  curl_easy_setopt(curl, CURLOPT_HTTPHEADER, hdrs);
  curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeToString);
  curl_easy_setopt(curl, CURLOPT_WRITEDATA, &body);
  curl_easy_setopt(curl, CURLOPT_TIMEOUT, timeout_sec);

  CURLcode res = curl_easy_perform(curl);
  long status = 0;
  if (res == CURLE_OK) curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &status);

  curl_slist_free_all(hdrs);
  curl_easy_cleanup(curl);

  if (res != CURLE_OK || status < 200 || status >= 300) return "";
  return body;
}

// ── Google auth ───────────────────────────────────────────────────────────────

// Try the GCE/Cloud Run metadata server. Returns empty string when not on GCE.
static std::string tokenFromMetadataServer() {
  std::string body = httpGet(
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
      {"Metadata-Flavor: Google"},
      1  // short timeout — fail fast when running locally
  );
  if (body.empty()) return "";

  Json::CharReaderBuilder b;
  Json::Value root;
  std::string errs;
  std::istringstream is(body);
  if (!Json::parseFromStream(b, is, &root, &errs)) return "";
  if (!root.isMember("access_token") || !root["access_token"].isString()) return "";
  return root["access_token"].asString();
}

// Exchange an ADC authorized_user refresh token for an access token.
static std::string tokenFromAdcFile(const std::string& path) {
  std::ifstream f(path);
  if (!f.is_open()) throw std::runtime_error("Cannot open ADC credentials file: " + path);

  std::string raw((std::istreambuf_iterator<char>(f)), std::istreambuf_iterator<char>());

  Json::CharReaderBuilder b;
  Json::Value creds;
  std::string errs;
  std::istringstream is(raw);
  if (!Json::parseFromStream(b, is, &creds, &errs))
    throw std::runtime_error("Failed to parse ADC credentials: " + errs);

  std::string type = creds.get("type", "").asString();
  if (type != "authorized_user")
    throw std::runtime_error(
        "Unsupported ADC credential type '" + type +
        "' — run: gcloud auth application-default login");

  CURL* curl = curl_easy_init();
  if (!curl) throw std::runtime_error("Failed to init curl for ADC token exchange");

  std::string body;
  char* eid  = curl_easy_escape(curl, creds["client_id"].asCString(),     0);
  char* esec = curl_easy_escape(curl, creds["client_secret"].asCString(), 0);
  char* ert  = curl_easy_escape(curl, creds["refresh_token"].asCString(), 0);
  std::string fields = std::string("grant_type=refresh_token") +
                       "&client_id="     + (eid  ? eid  : "") +
                       "&client_secret=" + (esec ? esec : "") +
                       "&refresh_token=" + (ert  ? ert  : "");
  if (eid)  curl_free(eid);
  if (esec) curl_free(esec);
  if (ert)  curl_free(ert);

  struct curl_slist* hdrs = nullptr;
  hdrs = curl_slist_append(hdrs, "Content-Type: application/x-www-form-urlencoded");

  curl_easy_setopt(curl, CURLOPT_URL, "https://oauth2.googleapis.com/token");
  curl_easy_setopt(curl, CURLOPT_POSTFIELDS, fields.c_str());
  curl_easy_setopt(curl, CURLOPT_HTTPHEADER, hdrs);
  curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeToString);
  curl_easy_setopt(curl, CURLOPT_WRITEDATA, &body);
  curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);

  CURLcode res = curl_easy_perform(curl);
  long status = 0;
  if (res == CURLE_OK) curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &status);
  curl_slist_free_all(hdrs);
  curl_easy_cleanup(curl);

  if (res != CURLE_OK || status < 200 || status >= 300)
    throw std::runtime_error("ADC token exchange failed (HTTP " + std::to_string(status) + ")");

  Json::CharReaderBuilder b2;
  Json::Value root;
  std::string errs2;
  std::istringstream is2(body);
  if (!Json::parseFromStream(b2, is2, &root, &errs2))
    throw std::runtime_error("Failed to parse ADC token response: " + errs2);
  if (!root.isMember("access_token") || !root["access_token"].isString())
    throw std::runtime_error("ADC token response missing access_token");

  return root["access_token"].asString();
}

// Returns a Google access token via metadata server (Cloud Run) or ADC (local).
static std::string getGoogleAccessToken() {
  // 1. Cloud Run / GCE metadata server
  std::string token = tokenFromMetadataServer();
  if (!token.empty()) return token;

  // 2. ADC credentials file
  const char* env = std::getenv("GOOGLE_APPLICATION_CREDENTIALS");
  std::string path;
  if (env && *env) {
    path = env;
  } else {
    const char* home = std::getenv("HOME");
    if (!home || !*home)
      throw std::runtime_error(
          "Cannot locate ADC credentials: set GOOGLE_APPLICATION_CREDENTIALS");
    path = std::string(home) + "/.config/gcloud/application_default_credentials.json";
  }
  return tokenFromAdcFile(path);
}

// ── Secret Manager REST ───────────────────────────────────────────────────────

std::string SpotifyAuth::readSecret(const std::string& secret_id) {
  std::string token = getGoogleAccessToken();

  std::string url =
      "https://secretmanager.googleapis.com/v1/projects/" + project_ +
      "/secrets/" + secret_id + "/versions/latest:access";

  std::string body = httpGet(url, {"Authorization: Bearer " + token});
  if (body.empty())
    throw std::runtime_error("Secret Manager request failed for: " + secret_id);

  Json::CharReaderBuilder b;
  Json::Value root;
  std::string errs;
  std::istringstream is(body);
  if (!Json::parseFromStream(b, is, &root, &errs))
    throw std::runtime_error("Failed to parse Secret Manager response: " + errs);

  if (!root.isMember("payload") || !root["payload"].isMember("data"))
    throw std::runtime_error("Secret Manager response missing payload.data for: " + secret_id);

  // Secret Manager encodes payload as standard base64
  return base64Decode(root["payload"]["data"].asString());
}

// ── Spotify token exchange ───────────────────────────────────────────────────

std::string SpotifyAuth::getAccessToken() {
  std::string refresh_token  = readSecret("spotify-refresh-token");
  std::string client_id      = readSecret("spotify-client-id");
  std::string client_secret  = readSecret("spotify-client-secret");

  std::string credentials = client_id + ":" + client_secret;
  std::string auth = "Authorization: Basic " + base64Encode(credentials);

  CURL* curl = curl_easy_init();
  if (!curl) throw std::runtime_error("Failed to init curl");

  std::string responseStr;
  struct curl_slist* headers = nullptr;
  headers = curl_slist_append(headers, "Content-Type: application/x-www-form-urlencoded");
  headers = curl_slist_append(headers, auth.c_str());

  char* escaped = curl_easy_escape(curl, refresh_token.c_str(), 0);
  std::string fields = std::string("grant_type=refresh_token&refresh_token=") +
                       (escaped ? escaped : "");
  if (escaped) curl_free(escaped);

  curl_easy_setopt(curl, CURLOPT_URL, "https://accounts.spotify.com/api/token");
  curl_easy_setopt(curl, CURLOPT_POSTFIELDS, fields.c_str());
  curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
  curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeToString);
  curl_easy_setopt(curl, CURLOPT_WRITEDATA, &responseStr);
  curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);

  CURLcode res = curl_easy_perform(curl);
  long http_code = 0;
  curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
  curl_slist_free_all(headers);
  curl_easy_cleanup(curl);

  if (res != CURLE_OK)
    throw std::runtime_error(std::string("Token exchange failed: ") + curl_easy_strerror(res));
  if (http_code < 200 || http_code >= 300)
    throw std::runtime_error("Token exchange failed: HTTP " + std::to_string(http_code));

  Json::CharReaderBuilder b;
  Json::Value root;
  std::string errs;
  std::istringstream is(responseStr);
  if (!Json::parseFromStream(b, is, &root, &errs))
    throw std::runtime_error("Failed to parse token response: " + errs);
  if (!root.isMember("access_token") || !root["access_token"].isString())
    throw std::runtime_error("Token response missing access_token");

  return root["access_token"].asString();
}
