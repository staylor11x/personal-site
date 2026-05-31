#pragma once

#include <drogon/HttpController.h>

class NowPlayingController : public drogon::HttpController<NowPlayingController> {
public:
  METHOD_LIST_BEGIN
  ADD_METHOD_TO(NowPlayingController::nowPlaying, "/api/now-playing", drogon::Get);
  METHOD_LIST_END

  void nowPlaying(const drogon::HttpRequestPtr& req,
                  std::function<void(const drogon::HttpResponsePtr&)>&& callback);
};
