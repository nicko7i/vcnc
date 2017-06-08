#include <sstream>
#include <cnctrq/cnctrqWorkspaceWorker.h>
#include <prtcl/core/pcSessionExport.H>
#include <cncSession.h>

#include <iostream>

namespace cnc {
  namespace cnctrq {
    using v8::Array;
    using v8::Context;
    using v8::Function;
    using v8::FunctionTemplate;
    using v8::Isolate;
    using v8::Handle;
    using v8::Local;
    using v8::Object;
    using v8::Persistent;
    using v8::Null;
    using v8::Number;
    using v8::String;
    using v8::Value;

	using frqu::prtcl::core::pcSessionExport;
    using cnc::cncSession;

    typedef pepsis::peer::cName::name_ptr name_ptr;
    typedef pString string_type;

    cnctrqWorkspaceWorker::cnctrqWorkspaceWorker(int trq_id
                                                 , path_type  path
                                                 , int operation
                                                 , Nan::Callback* callback) 
      : AsyncWorker(callback)
      , _path(path)
      , _operation(operation)
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

    cnctrqWorkspaceWorker::cnctrqWorkspaceWorker(int trq_id
                                                 , path_type  path
                                                 , string_type spec
                                                 , bool overwrite
                                                 , bool push
                                                 , int operation
                                                 , Nan::Callback* callback) 
      : AsyncWorker(callback)
      , _path(path)
      , _input_spec(spec)
      , _overwrite(overwrite)
      , _push(push)
      , _operation(operation)
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
    cnctrqWorkspaceWorker::~cnctrqWorkspaceWorker() { delete _client; }
    //
    //  Execute
    //
    void cnctrqWorkspaceWorker::Execute() {
      if (_errcode)
        return;  // An error has occurred before we were called.
      switch (_operation) {
      case op_children:
        _errcode = _client->WorkspaceChildren(_path, _workspace_list);
        break;
      case op_delete:
        _errcode = _client->WorkspaceDelete(_path
                                            , true  // recursive
                                            , _push);
        break;
      case op_get:
        _errcode = _client->WorkspaceGet(_path, _workspace);
        break;
      case op_set:
//    	std::cout << "op_set: " << _input_spec.c_str() << std::endl;
        if (_workspace.ImportJson(_input_spec)) {
          _errcode = -EINVAL;
          std::cerr << "cnctrqWorkspaceWorker: Invalid JSON: " << _input_spec << std::endl;
          return;
        }
        _errcode = _client->WorkspaceSet(_path
                                         , _workspace
                                         , _overwrite
                                         , _push);
        break;
      default:
        std::cerr << "cnctrqWorkspaceWorker: unexpected default switch: " << std::endl;
        _errcode = -EINVAL;
      }
    }
    //
    //  HandleOKCallback
    //
    void cnctrqWorkspaceWorker::HandleOKCallback() {
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
      std::ostringstream buffer;
      // std::cout << "http_status=" << http_status <<"\n";
      // std::cout << "_errcode=" << _errcode <<"\n";
      // std::cout << "error_sym=" << error_sym <<"\n";
      // std::cout << "error_description_brief=" << error_description_brief <<"\n";
      // std::cout << "_errcode=" << _errcode <<"\n";
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
      string_type arr_ws = "";
      switch (_operation) {
      case op_children:
      {
        _workspace_list.ExportJson(arr_ws, true);
        Nan::Set(rtn
                 , Nan::New("ws_children").ToLocalChecked()
                 , Nan::New(arr_ws.c_str()).ToLocalChecked());
      }
      break;
      case op_delete:
        // intentionally empty
        break;
      case op_get:
      {
//    	std::cout << "ExportJson(): " << _workspace.ExportJson();
        Nan::Set(rtn
                 , Nan::New("ws").ToLocalChecked()
                 , Nan::New(_workspace.ExportJson().c_str()).ToLocalChecked());
      }
      break;
      case op_set:
        break;
      default:
        std::cerr << "cnctrqWorkspaceWorker: ASSERTION" << std::endl;
        assert(0);
      }
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
