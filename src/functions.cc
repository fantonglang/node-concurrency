#include "functions.h"

#include <iostream>
#include <semaphore.h>

struct SemData
{
  Nan::Persistent<v8::BigInt> refObject;
  sem_t *sem;
};

static sem_t* __getSS(Nan::NAN_METHOD_ARGS_TYPE info) {
  v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();
  v8::Local<v8::BigInt> intval = info[0]->ToBigInt(context).ToLocalChecked();
  uint64_t semval = intval->Uint64Value();
  return (sem_t *)semval;
}

static int __getint(Nan::NAN_METHOD_ARGS_TYPE info, int i) {
  v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();
  return info[i]->Int32Value(context).FromJust();
}

static const char* __getstr(Nan::NAN_METHOD_ARGS_TYPE info, int i) {
  v8::String::Utf8Value str(info.GetIsolate(), info[i]);
  return strdup(*str);
}

void cleanupSem(const Nan::WeakCallbackInfo<SemData> &info) {
  SemData *data = info.GetParameter();
  if (data != nullptr) {
    sem_t *sem = data->sem;
    sem_close(sem);
    delete data;
  }
}

NAN_METHOD(sem_open) {
  const char *name = __getstr(info, 0);
  int oflag = __getint(info, 1);
  int mode = __getint(info, 2);
  int value = __getint(info, 3);
  sem_t *sem = sem_open(name, oflag, mode, value);
  if (sem == SEM_FAILED) {
    info.GetReturnValue().SetNull();
    return;
  }
  
  v8::Local<v8::BigInt> retv = v8::BigInt::New(v8::Isolate::GetCurrent(), (uint64_t)sem);
  SemData *data = new SemData();
  data->sem = sem;
  data->refObject.Reset(retv);

  data->refObject.SetWeak(data, cleanupSem, Nan::WeakCallbackType::kParameter);
  info.GetReturnValue().Set(retv);
}

NAN_METHOD(sem_close) {
  sem_t *sem = __getSS(info);
  int closeRes = sem_close(sem);
  info.GetReturnValue().Set(closeRes);
}

NAN_METHOD(sem_post) {
  sem_t *sem = __getSS(info);
  int postRes = sem_post(sem);
  info.GetReturnValue().Set(postRes);
}

NAN_METHOD(sem_trywait) {
  sem_t *sem = __getSS(info);
  int trywaitRes = sem_trywait(sem);
  info.GetReturnValue().Set(trywaitRes);
}

NAN_METHOD(sem_unlink) {
  const char *name = __getstr(info, 0);
  int unlinkRes = sem_unlink(name);
  info.GetReturnValue().Set(unlinkRes);
}

NAN_METHOD(sem_wait) {
  sem_t *sem = __getSS(info);
  int waitRes = sem_wait(sem);
  info.GetReturnValue().Set(waitRes);
}