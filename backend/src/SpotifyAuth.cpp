#include "SpotifyAuth.h"

#include <curl/curl.h>
#include <json/json.h>

#include <google/cloud/secretmanager/secret_manager_client.h>

#include <stdexcept>
#include <sstream>

using namespace std;
namespace secretmanager = ::google::cloud::secretmanager;

SpotifyAuth::SpotifyAuth(std::string project_id) : project_(std::move(project_id)) {}

static string base64Encode(const string& in) {
  static const char* b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  string out;
  int val=0, valb=-6;
  for (unsigned char c : in) {
    val = (val<<8) + c;
    valb += 8;
    while (valb>=0) {
      out.push_back(b64[(val>>valb)&0x3F]);
      valb-=6;
    }
  }
  if (valb>-6) out.push_back(b64[((val<<8)>>(valb+8))&0x3F]);
  while (out.size()%4) out.push_back('=');
  return out;
}

string SpotifyAuth::readSecret(const string& secret_id) {
  auto client = secretmanager::SecretManagerServiceClient(
      secretmanager::MakeSecretManagerServiceConnection());

  google::cloud::secretmanager::v1::AccessSecretVersionRequest request;
  request.set_name("projects/" + project_ + "/secrets/" + secret_id + "/versions/latest");

  auto response = client.AccessSecretVersion(request);
  if (!response) {
    std::ostringstream ss;
    ss << "Secret Manager access failed for '" << secret_id << "': " << response.status();
    throw std::runtime_error(ss.str());
  }

  auto payload = response->payload().data();
  return string(payload.begin(), payload.end());
}

static size_t writeToString(void* ptr, size_t size, size_t nmemb, void* userdata) {
  auto realSize = size * nmemb;
  string* s = reinterpret_cast<string*>(userdata);
  s->append(reinterpret_cast<char*>(ptr), realSize);
  return realSize;
}

string SpotifyAuth::getAccessToken() {
  // Read secrets
  string refresh_token = readSecret("spotify-refresh-token");
  string client_id = readSecret("spotify-client-id");
  string client_secret = readSecret("spotify-client-secret");

  // Basic auth header (client_id:client_secret) base64
  string credentials = client_id + ":" + client_secret;
  string auth = string("Authorization: Basic ") + base64Encode(credentials);

  CURL* curl = curl_easy_init();
  if (!curl) throw std::runtime_error("Failed to init curl");
  string responseStr;
  struct curl_slist* headers = nullptr;
  headers = curl_slist_append(headers, "Content-Type: application/x-www-form-urlencoded");
  headers = curl_slist_append(headers, auth.c_str());

  // URL-encode refresh token
  char* escaped = curl_easy_escape(curl, refresh_token.c_str(), 0);
  string fields = string("grant_type=refresh_token&refresh_token=") + (escaped ? escaped : "");
  if (escaped) curl_free(escaped);

  curl_easy_setopt(curl, CURLOPT_URL, "https://accounts.spotify.com/api/token");
  curl_easy_setopt(curl, CURLOPT_POSTFIELDS, fields.c_str());
  curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
  curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeToString);
  curl_easy_setopt(curl, CURLOPT_WRITEDATA, &responseStr);
  curl_easy_setopt(curl, CURLOPT_FAILONERROR, 1L);

  CURLcode res = curl_easy_perform(curl);
  long http_code = 0;
  curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &http_code);
  curl_slist_free_all(headers);
  curl_easy_cleanup(curl);

  if (res != CURLE_OK) {
    std::ostringstream ss;
    ss << "Token exchange failed: curl error: " << curl_easy_strerror(res);
    throw std::runtime_error(ss.str());
  }
  if (http_code < 200 || http_code >= 300) {
    std::ostringstream ss;
    ss << "Token exchange failed: HTTP status " << http_code << " response: " << responseStr;
    throw std::runtime_error(ss.str());
  }

  Json::CharReaderBuilder b;
  Json::Value root;
  std::string errs;
  std::istringstream is(responseStr);
  if (!Json::parseFromStream(b, is, &root, &errs)) {
    throw std::runtime_error("Failed to parse token response JSON: " + errs);
  }
  if (!root.isMember("access_token") || !root["access_token"].isString()) {
    throw std::runtime_error("Token response missing access_token: " + responseStr);
  }
  return root["access_token"].asString();
}
