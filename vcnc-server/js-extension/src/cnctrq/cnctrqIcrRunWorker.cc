#include <cnctrq/cnctrqIcrRunWorker.h>
#include <prtcl/core/pcSessionExport.H>
#include <cncSession.h>
#include <peer/cSession.H>
#include <sys/stat.h>
#include <prtcl/iCncTrq.H>

#include <iostream>

using v8::Array;
using v8::Context;
using v8::Function;
using v8::FunctionTemplate;
using v8::Handle;
using v8::Local;
using v8::Object;
using v8::Persistent;
using v8::String;
using v8::Value;

using cnc::cncSession;
using pepsis::peer::cSession;
using frqu::prtcl::core::pcSessionExport;
using frqu::prtcl::cnctrq::cnctrqClient;

typedef pepsis::peer::cName::name_ptr name_ptr;
typedef pepsis::peer::cHost::host_ptr host_ptr;

namespace cnc {
  namespace cnctrq {
	  
	typedef pString string_type;

    cnctrqIcrRunWorker::cnctrqIcrRunWorker(int trq_id
                                             , path_type path
                                             , Nan::Callback* callback) 
      : AsyncWorker(callback)
      , _path(path)
      , _errcode(0)
      , _client(0)
    {
      //
      //  Obtain the TRQ's hostname from its TRQ ID.
      //
      name_ptr trq_hostname 
        = pcSessionExport::self().HostnameByTrqID(trq_id);
      if (!trq_hostname) {
        _errcode = -EHOSTDOWN;
        return;
      }
      //
      //  Create the RPC client
      //
      _client = new frqu::prtcl::cnctrq::cnctrqClient(trq_hostname);
    }
    //
    //  Destructor.
    //
    cnctrqIcrRunWorker::~cnctrqIcrRunWorker() { delete _client; }
    //
    //  Execute
    //
    void cnctrqIcrRunWorker::Execute() {
      if (_errcode) 
        return;  // An error has occurred before we were called.
      _errcode = _client->IcrRun(_path);
    }
    //
    //  HandleOKCallback
    //
    void cnctrqIcrRunWorker::HandleOKCallback() {
      //
      //  Elaborate the error code.
      //
      int http_status;
      string_type error_sym;
      string_type error_description_brief;
      cncSession::self().RpcToHttpStatus(_errcode
                                        , http_status
                                        , error_sym
                                        , error_description_brief);
      //
      //  Allocate the return object
      //
      Local<Object> rtn = Nan::New<Object>();
      Nan::Set(rtn
               , Nan::New("errcode").ToLocalChecked()
               , Nan::New(_errcode));
      Nan::Set(rtn
               , Nan::New("http_status").ToLocalChecked()
               , Nan::New(http_status));
      Nan::Set(rtn
               , Nan::New("error_sym").ToLocalChecked()
               , Nan::New(error_sym.c_str()).ToLocalChecked());
      Nan::Set(rtn
               , Nan::New("error_description_brief").ToLocalChecked()
               , Nan::New(error_description_brief.c_str()).ToLocalChecked());
      //
      //  Prepare for callback
      //
      const unsigned argc = 1;
      Local<Value> argv[argc] = { rtn };
      callback->Call(argc, argv);
    }
    //
  } // namespace 'cnctrq'
} // namespace 'cnc'
