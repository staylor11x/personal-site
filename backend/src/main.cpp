#include <drogon/drogon.h>
#include <json/json.h>

using namespace drogon;

int main() {
  app().registerHandler("/health",
    [](const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback){
      Json::Value ret;
      ret["status"] = "ok";
      auto resp = HttpResponse::newHttpJsonResponse(ret);
      callback(resp);
    }, {Get});

  app().addListener("0.0.0.0", 8080);
  app().run();
  return 0;
}
