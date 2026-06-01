#include "NowPlayingController.h"
#include "SpotifyAuth.h"

#include <curl/curl.h>
#include <json/json.h>

#include <array>
#include <trantor/utils/Logger.h>

using namespace drogon;

static size_t writeToString(void* ptr, size_t size, size_t nmemb, void* userdata) {
  std::string* s = static_cast<std::string*>(userdata);
  s->append(static_cast<char*>(ptr), size * nmemb);
  return size * nmemb;
}

static void applyCorsHeaders(const HttpRequestPtr& req, const HttpResponsePtr& res) {
  static const std::array<std::string, 2> allowedOrigins = {
      "https://scott-taylor11.com",
      "https://www.scott-taylor11.com",
  };

  const std::string origin = req ? req->getHeader("origin") : "";
  bool matched = false;
  for (const auto& allowedOrigin : allowedOrigins) {
    if (origin == allowedOrigin) {
      res->addHeader("Access-Control-Allow-Origin", allowedOrigin);
      res->addHeader("Vary", "Origin");
      LOG_INFO << "[CORS] matched origin: " << allowedOrigin;
      matched = true;
      break;
    }
  }

  if (!matched) {
    if (origin.empty()) {
      LOG_INFO << "[CORS] no Origin header — using default www origin";
    } else {
      LOG_WARN << "[CORS] unrecognised origin: '" << origin << "' — not adding ACAO header";
    }
    if (origin.empty()) {
      res->addHeader("Access-Control-Allow-Origin", "https://www.scott-taylor11.com");
    }
  }

  res->addHeader("Access-Control-Allow-Methods", "GET");
}

static HttpResponsePtr makeUpstreamFailureResponse(const HttpRequestPtr& req) {
  Json::Value err;
  err["error"] = "upstream_failure";
  auto r = HttpResponse::newHttpJsonResponse(err);
  applyCorsHeaders(req, r);
  r->setStatusCode(k502BadGateway);
  return r;
}

static HttpResponsePtr makeNotPlayingResponse(const HttpRequestPtr& req) {
  Json::Value out;
  out["playing"] = false;
  auto r = HttpResponse::newHttpJsonResponse(out);
  applyCorsHeaders(req, r);
  r->setStatusCode(k200OK);
  return r;
}

void NowPlayingController::nowPlaying(
    const HttpRequestPtr& req,
    std::function<void(const HttpResponsePtr&)>&& callback) {
  const std::string origin = req ? req->getHeader("origin") : "(none)";
  LOG_INFO << "[NowPlaying] request from origin: " << origin;

  try {
    LOG_INFO << "[NowPlaying] fetching Spotify access token...";
    SpotifyAuth auth;
    std::string token = auth.getAccessToken();
    LOG_INFO << "[NowPlaying] access token obtained (len=" << token.size() << ")";

    CURL* curl = curl_easy_init();
    if (!curl) {
      LOG_ERROR << "[NowPlaying] curl_easy_init() failed";
      callback(makeUpstreamFailureResponse(req));
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
      LOG_ERROR << "[NowPlaying] Spotify API curl error: " << curl_easy_strerror(res);
      callback(makeUpstreamFailureResponse(req));
      return;
    }

    LOG_INFO << "[NowPlaying] Spotify API HTTP status: " << statusCode;

    if (statusCode == 204) {
      LOG_INFO << "[NowPlaying] Spotify returned 204 — nothing playing";
      callback(makeNotPlayingResponse(req));
      return;
    }

    if (statusCode != 200) {
      LOG_WARN << "[NowPlaying] unexpected Spotify status: " << statusCode << " body: " << respBody;
      callback(makeUpstreamFailureResponse(req));
      return;
    }

    Json::CharReaderBuilder b;
    std::string errs;
    Json::Value root;
    std::unique_ptr<Json::CharReader> reader(b.newCharReader());
    if (!reader->parse(respBody.c_str(), respBody.c_str() + respBody.size(), &root, &errs)) {
      LOG_ERROR << "[NowPlaying] JSON parse error: " << errs << " body: " << respBody;
      callback(makeUpstreamFailureResponse(req));
      return;
    }

    bool isPlaying = false;
    if (root.isMember("is_playing") && root["is_playing"].isBool()) {
      isPlaying = root["is_playing"].asBool();
    }
    LOG_INFO << "[NowPlaying] is_playing: " << (isPlaying ? "true" : "false");

    if (!isPlaying) {
      LOG_INFO << "[NowPlaying] track not playing — returning empty state";
      callback(makeNotPlayingResponse(req));
      return;
    }
    if (!root.isMember("item") || !root["item"].isObject()) {
      LOG_WARN << "[NowPlaying] is_playing=true but 'item' missing or not an object";
      callback(makeUpstreamFailureResponse(req));
      return;
    }

    Json::Value item = root["item"];
    if (!item.isObject() || !item.isMember("name") || !item["name"].isString()) {
      LOG_WARN << "[NowPlaying] item missing 'name' field";
      callback(makeUpstreamFailureResponse(req));
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

    LOG_INFO << "[NowPlaying] responding: title='" << title << "' artist='" << artist << "' album='" << album << "'";

    auto r = HttpResponse::newHttpJsonResponse(out);
    applyCorsHeaders(req, r);
    callback(r);

  } catch (const std::exception& e) {
    LOG_ERROR << "[NowPlaying] unhandled exception: " << e.what();
    callback(makeUpstreamFailureResponse(req));
  }
}
