{
  "targets": [
    {
      "target_name": "NativeExtension",
      "sources": [ "src/NativeExtension.cc", "src/functions.cc" ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ]
    }
  ],
}