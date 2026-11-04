cmake_minimum_required(VERSION 3.9)

cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

project(highs_addon)

set(HIGHS_LIB_FILENAME "${CMAKE_STATIC_LIBRARY_PREFIX}highs${CMAKE_STATIC_LIBRARY_SUFFIX}")

set(HIGHS_MSVC_ARGS "")
if(MSVC)
  set (CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreadedDLL")
  string(REPLACE "/MT" "/MD" CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}")
  string(REPLACE "/MT" "/MD" CMAKE_C_FLAGS "${CMAKE_C_FLAGS}")
  string(REPLACE "/MT" "/MD" CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE}")
  string(REPLACE "/MT" "/MD" CMAKE_C_FLAGS_RELEASE "${CMAKE_C_FLAGS_RELEASE}")

  list(APPEND HIGHS_MSVC_ARGS
        -DCMAKE_C_FLAGS_RELEASE=/MD
        -DCMAKE_CXX_FLAGS_RELEASE=/MD
        -DCMAKE_C_FLAGS=/MD
        -DCMAKE_CXX_FLAGS=/MD
    )

  set(HIGHS_BYPRODUCT_PATH "${binary_dir}/lib/Release/${HIGHS_LIB_FILENAME}")
  set(HIGHS_STATIC_LIB "<BINARY_DIR>/lib/Release/${HIGHS_LIB_FILENAME}")
else()
  set(HIGHS_BYPRODUCT_PATH "${binary_dir}/lib/${HIGHS_LIB_FILENAME}")
  set(HIGHS_STATIC_LIB "<BINARY_DIR>/lib/${HIGHS_LIB_FILENAME}")
endif()

add_definitions(-DNAPI_VERSION=8)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

# Download HiGHS
include(ExternalProject)
ExternalProject_Add(highs_download
  GIT_REPOSITORY https://github.com/ERGO-Code/HiGHS.git
  GIT_TAG "fd8665394edfd096c4f847c4a6fbc187364ef474" # v1.10.0
  CMAKE_ARGS
    -DBUILD_SHARED_LIBS=OFF
    -DBUILD_TESTING=OFF
    -DCI=OFF
    -DFAST_BUILD=OFF
    -DCMAKE_BUILD_TYPE=Release
    -DCMAKE_CXX_COMPILER_LAUNCHER=${CMAKE_CXX_COMPILER_LAUNCHER}
    -DZLIB=OFF
    ${HIGHS_MSVC_ARGS}
  BUILD_COMMAND ${CMAKE_COMMAND} --build . --config Release --target libhighs
  INSTALL_COMMAND ""
  BUILD_BYPRODUCTS ${HIGHS_STATIC_LIB}
)
ExternalProject_Get_Property(highs_download source_dir)
ExternalProject_Get_Property(highs_download binary_dir)

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  # Generate node.lib
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()

# Build binding
include_directories(${CMAKE_JS_INC} ${source_dir}/src ${binary_dir})
file(GLOB SOURCE_FILES "src/*.cc")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
add_dependencies(${PROJECT_NAME} highs_download)
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} ${HIGHS_BYPRODUCT_PATH})
