#include <cnctrq/cnctrqListWorker.h>
#include <prtcl/core/pcSessionExport.H>
#include <cncSession.h>

#include <iostream>

namespace cnc {
  namespace cnctrq {
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

    using frqu::prtcl::core::pcSessionExport;
    using cnc::cncSession;

    typedef pepsis::peer::cName::name_ptr name_ptr;
    typedef pString string_type;

    cnctrqListWorker::cnctrqListWorker(int trq_id
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
    cnctrqListWorker::~cnctrqListWorker() { delete _client; }
    //
    //  Execute
    //
    void cnctrqListWorker::Execute() {
      if (_errcode) 
        return;  // An error has occurred before we were called.
      _errcode = _client->List(_path, _results);
    }
    //
    //  HandleOKCallback
    //
    void cnctrqListWorker::HandleOKCallback() {
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
      //  Marshall the results
      //  {
      //    "error_sym": "OK",
      //    "result": [
      //      "fileA"
      //    ]
      //  }
      //
      Local<Array> children = Nan::New<Array>(_results.size());
      int i(0);
      for (results_t::iterator itr = _results.begin()
             ; itr != _results.end()
             ; ++i, ++itr) {
        Nan::Set(children, i, Nan::New(itr->c_str()).ToLocalChecked());
      }
      Nan::Set(rtn
               , Nan::New("result").ToLocalChecked()
               , children);
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
