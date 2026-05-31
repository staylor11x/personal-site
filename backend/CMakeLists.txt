cmake_minimum_required(VERSION 3.16)
project(personal_site_backend LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)

include(FetchContent)

FetchContent_Declare(
  drogon
  GIT_REPOSITORY https://github.com/drogonframework/drogon.git
  GIT_TAG master
)

FetchContent_MakeAvailable(drogon)

add_executable(backend src/main.cpp)
target_link_libraries(backend PRIVATE Drogon::Drogon)
set_target_properties(backend PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR})
