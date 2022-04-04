#include "functions.h"

using v8::FunctionTemplate;

NAN_MODULE_INIT(InitAll) {
  Nan::Set(target, Nan::New("sem_open").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(sem_open)).ToLocalChecked());
  Nan::Set(target, Nan::New("sem_close").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(sem_close)).ToLocalChecked());
  Nan::Set(target, Nan::New("sem_post").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(sem_post)).ToLocalChecked());
  Nan::Set(target, Nan::New("sem_trywait").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(sem_trywait)).ToLocalChecked());
  Nan::Set(target, Nan::New("sem_unlink").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(sem_unlink)).ToLocalChecked());
  Nan::Set(target, Nan::New("sem_wait").ToLocalChecked(),
    Nan::GetFunction(Nan::New<FunctionTemplate>(sem_wait)).ToLocalChecked());
}

NODE_MODULE(NativeExtension, InitAll)