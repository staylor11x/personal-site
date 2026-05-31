#include "NowPlayingController.h"
#include "SpotifyAuth.h"

#include <curl/curl.h>
#include <json/json.h>

using namespace drogon;

static size_t writeToString(void* ptr, size_t size, size_t nmemb, void* userdata) {
  std::string* s = static_cast<std::string*>(userdata);
  s->append(static_cast<char*>(ptr), size * nmemb);
  return size * nmemb;
}

static HttpResponsePtr makeUpstreamFailureResponse() {
  Json::Value err;
  err["error"] = "upstream_failure";
  auto r = HttpResponse::newHttpJsonResponse(err);
  r->addHeader("Access-Control-Allow-Origin", "https://www.scott-taylor11.com");
  r->addHeader("Access-Control-Allow-Methods", "GET");
  r->setStatusCode(k502BadGateway);
  return r;
}

void NowPlayingController::nowPlaying(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& callback) {
  try {
    SpotifyAuth auth;
    std::string token = auth.getAccessToken();

    CURL* curl = curl_easy_init();
    if (!curl) {
      callback(makeUpstreamFailureResponse());
      return;
    }

    std::string respBody;
    struct curl_slist* headers = NULL;
    std::string authHeader = "Authorization: Bearer " + token;
    headers = curl_slist_append(headers, authHeader.c_str());
    headers = curl_slist_append(headers, "Accept: application/json");

    curl_easy_setopt(curl, CURLOPT_URL, "https://api.spotify.com/v1/me/player/currently-playing");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeToString);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &respBody);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L);

    CURLcode res = curl_easy_perform(curl);
    long statusCode = 0;
    if (res == CURLE_OK) {
      curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &statusCode);
    }

    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
      callback(makeUpstreamFailureResponse());
      return;
    }

    if (statusCode == 204) {
      Json::Value out;
      out["playing"] = false;
      auto r = HttpResponse::newHttpJsonResponse(out);
      r->addHeader("Access-Control-Allow-Origin", "https://www.scott-taylor11.com");
      r->addHeader("Access-Control-Allow-Methods", "GET");
      r->setStatusCode(k204NoContent);
      callback(r);
      return;
    }

    if (statusCode != 200) {
      callback(makeUpstreamFailureResponse());
      return;
    }

    Json::CharReaderBuilder b;
    std::string errs;
    Json::Value root;
    std::unique_ptr<Json::CharReader> reader(b.newCharReader());
    if (!reader->parse(respBody.c_str(), respBody.c_str() + respBody.size(), &root, &errs)) {
      callback(makeUpstreamFailureResponse());
      return;
    }

    bool isPlaying = false;
    if (root.isMember("is_playing") && root["is_playing"].isBool()) {
      isPlaying = root["is_playing"].asBool();
    }
    if (!isPlaying || !root.isMember("item") || !root["item"].isObject()) {
      callback(makeUpstreamFailureResponse());
      return;
    }

    Json::Value item = root["item"];
    if (!item.isObject() || !item.isMember("name") || !item["name"].isString()) {
      callback(makeUpstreamFailureResponse());
      return;
    }

    std::string title = item["name"].asString();
    std::string artist;
    if (item.isMember("artists") && item["artists"].isArray() && item["artists"].size() > 0) {
      if (item["artists"][0].isMember("name") && item["artists"][0]["name"].isString()) {
        artist = item["artists"][0]["name"].asString();
      }
    }
    std::string album;
    std::string albumArtUrl;
    if (item.isMember("album") && item["album"].isObject()) {
      if (item["album"].isMember("name") && item["album"]["name"].isString()) {
        album = item["album"]["name"].asString();
      }
      if (item["album"].isMember("images") && item["album"]["images"].isArray() &&
          item["album"]["images"].size() > 0) {
        if (item["album"]["images"][0].isMember("url") &&
            item["album"]["images"][0]["url"].isString()) {
          albumArtUrl = item["album"]["images"][0]["url"].asString();
        }
      }
    }

    Json::Value out;
    out["playing"] = true;
    out["title"] = title;
    out["artist"] = artist;
    out["album"] = album;
    out["albumArtUrl"] = albumArtUrl;

    auto r = HttpResponse::newHttpJsonResponse(out);
    r->addHeader("Access-Control-Allow-Origin", "https://www.scott-taylor11.com");
    r->addHeader("Access-Control-Allow-Methods", "GET");
    callback(r);

  } catch (const std::exception&) {
    callback(makeUpstreamFailureResponse());
  }
}
