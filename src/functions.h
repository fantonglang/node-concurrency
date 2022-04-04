#ifndef NATIVE_EXTENSION_GRAB_H
#define NATIVE_EXTENSION_GRAB_H

#include <nan.h>

NAN_METHOD(sem_open);
NAN_METHOD(sem_close);
NAN_METHOD(sem_post);
NAN_METHOD(sem_trywait);
NAN_METHOD(sem_unlink);
NAN_METHOD(sem_wait);

#endif