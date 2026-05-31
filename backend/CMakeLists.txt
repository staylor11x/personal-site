cmake_minimum_required(VERSION 3.16)
project(personal_site_backend LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)

include(FetchContent)

FetchContent_Declare(
  drogon
  GIT_REPOSITORY https://github.com/drogonframework/drogon.git
  GIT_TAG v1.9.10
)

FetchContent_MakeAvailable(drogon)

# Fetch google-cloud-cpp (only enable Secret Manager component)
FetchContent_Declare(
  google_cloud_cpp
  GIT_REPOSITORY https://github.com/googleapis/google-cloud-cpp.git
  GIT_TAG v2.13.0
)
# Prefer bundled dependency provider to simplify builder stage
set(FETCHCONTENT_QUIET OFF)
set(GOOGLE_CLOUD_CPP_DEPENDENCY_PROVIDER bundled CACHE STRING )
set(BUILD_SHARED_LIBS ON CACHE BOOL )
set(GOOGLE_CLOUD_CPP_ENABLE_SECRET_MANAGER ON CACHE BOOL Enable
