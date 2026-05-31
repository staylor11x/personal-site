#pragma once

#include <string>

class SpotifyAuth {
public:
  explicit SpotifyAuth(std::string project_id = "personal-site-497615");
  // Fetches an access token by refreshing the stored refresh token.
  // Throws std::runtime_error on any failure.
  std::string getAccessToken();

private:
  std::string readSecret(const std::string& secret_id);
  std::string project_;
};
