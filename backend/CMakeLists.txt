cmake_minimum_required(VERSION 3.16)
project(personal_site_backend LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)

include(FetchContent)

# Shallow clone — no history needed, cuts clone time significantly
FetchContent_Declare(
  drogon
  GIT_REPOSITORY https://github.com/drogonframework/drogon.git
  GIT_TAG v1.9.10
  GIT_SHALLOW TRUE
)

FetchContent_MakeAvailable(drogon)

find_package(CURL REQUIRED)

add_executable(backend
  src/main.cpp
  src/SpotifyAuth.cpp
  src/NowPlayingController.cpp
)

target_include_directories(backend PRIVATE src)

target_link_libraries(backend PRIVATE
  drogon
  CURL::libcurl
)
