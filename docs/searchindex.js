Search.setIndex({docnames:["about-vcnc/vcnc-architecture","api-reference/modules","api-reference/velstor","api-reference/velstor.pcapi","api-reference/velstor.restapi","developer/about-this-document","developer/building/build-prepare","developer/building/vclc-pyapi-build","developer/building/vcnc-server-build","developer/building/vcnc-web-build","developer/coding-policies","developer/design-notes","developer/documentation-build","developer/documentation-publish","developer/ide","developer/install-and-build/config-dev-env","developer/install-and-build/documentation-build","developer/install-and-build/vclc-pyapi-build","developer/install-and-build/vcnc-server-build","developer/install-and-build/vcnc-server-external-build","developer/install-and-build/vcnc-server-internal-build","developer/install-and-build/vcnc-web-build","developer/python-api","developer/run/run-prepare","developer/run/vclc-run","developer/run/vcnc-server-run","developer/run/vcnc-web-run","developer/vclc","developer/vcnc-rest","developer/vcnc-web","developer/workflow","index","user/getting-started","user/users-and-security","user/vcnc-clients"],envversion:51,filenames:["about-vcnc/vcnc-architecture.rst","api-reference/modules.rst","api-reference/velstor.rst","api-reference/velstor.pcapi.rst","api-reference/velstor.restapi.rst","developer/about-this-document.rst","developer/building/build-prepare.rst","developer/building/vclc-pyapi-build.rst","developer/building/vcnc-server-build.rst","developer/building/vcnc-web-build.rst","developer/coding-policies.rst","developer/design-notes.rst","developer/documentation-build.rst","developer/documentation-publish.rst","developer/ide.rst","developer/install-and-build/config-dev-env.rst","developer/install-and-build/documentation-build.rst","developer/install-and-build/vclc-pyapi-build.rst","developer/install-and-build/vcnc-server-build.rst","developer/install-and-build/vcnc-server-external-build.rst","developer/install-and-build/vcnc-server-internal-build.rst","developer/install-and-build/vcnc-web-build.rst","developer/python-api.rst","developer/run/run-prepare.rst","developer/run/vclc-run.rst","developer/run/vcnc-server-run.rst","developer/run/vcnc-web-run.rst","developer/vclc.rst","developer/vcnc-rest.rst","developer/vcnc-web.rst","developer/workflow.rst","index.rst","user/getting-started.rst","user/users-and-security.rst","user/vcnc-clients.rst"],objects:{"":{velstor:[2,0,0,"-"]},"velstor.libtest":{VclcError:[2,1,1,""],command:[2,3,1,""],create_workspace:[2,3,1,""],create_workspace_vtrq:[2,3,1,""],delete_workspace_vtrq:[2,3,1,""],mount_vp:[2,3,1,""],random_identifier:[2,3,1,""],random_path:[2,3,1,""],unmount_vp:[2,3,1,""],vclc:[2,3,1,""]},"velstor.libtest.VclcError":{cmd:[2,2,1,""],error_sym:[2,2,1,""],http_status:[2,2,1,""],msg:[2,2,1,""],output:[2,2,1,""],returncode:[2,2,1,""]},"velstor.libutil":{CommonEqualityMixin:[2,4,1,""],rpc_status_to_http_status:[2,3,1,""],synthetic_response:[2,3,1,""],unpack_response:[2,3,1,""],urlencode:[2,3,1,""]},"velstor.pcapi":{exceptions:[3,0,0,"-"],mount:[3,0,0,"-"],namespace:[3,0,0,"-"],volume:[3,0,0,"-"],workspace:[3,0,0,"-"]},"velstor.pcapi.exceptions":{RESTException:[3,1,1,""],raise_if_not_2xx:[3,3,1,""]},"velstor.pcapi.exceptions.RESTException":{error_sym:[3,2,1,""],http_code:[3,2,1,""]},"velstor.pcapi.mount":{Mount:[3,4,1,""]},"velstor.pcapi.mount.Mount":{dispose:[3,5,1,""],is_private:[3,2,1,""],mount_point:[3,2,1,""],pathname:[3,2,1,""],vtrq_id:[3,2,1,""],vtrq_path:[3,2,1,""],workspace:[3,2,1,""],writeback:[3,2,1,""]},"velstor.pcapi.namespace":{Namespace:[3,4,1,""]},"velstor.pcapi.namespace.Namespace":{"delete":[3,5,1,""],clone:[3,5,1,""],cwd:[3,5,1,""],list:[3,5,1,""],ls:[3,5,1,""],mkdir:[3,5,1,""],mkfile:[3,5,1,""]},"velstor.pcapi.volume":{Volume:[3,4,1,""]},"velstor.pcapi.volume.Volume":{mount:[3,5,1,""],mount_point:[3,2,1,""],unmount:[3,5,1,""],workspace:[3,2,1,""]},"velstor.pcapi.workspace":{Workspace:[3,4,1,""]},"velstor.pcapi.workspace.Workspace":{"delete":[3,5,1,""],get:[3,5,1,""],is_private:[3,2,1,""],json:[3,2,1,""],pathname:[3,2,1,""],set:[3,5,1,""],vtrq_id:[3,2,1,""],vtrq_path:[3,2,1,""],writeback:[3,2,1,""]},"velstor.restapi":{fulfill202:[4,0,0,"-"],grid:[4,0,0,"-"],namespace:[4,0,0,"-"],service:[4,0,0,"-"],session:[4,0,0,"-"],vp:[4,0,0,"-"],workspace:[4,0,0,"-"]},"velstor.restapi.fulfill202":{fulfill202:[4,3,1,""]},"velstor.restapi.grid":{"delete":[4,3,1,""],get:[4,3,1,""],list:[4,3,1,""],post:[4,3,1,""]},"velstor.restapi.namespace":{"delete":[4,3,1,""],copy_vector:[4,3,1,""],list:[4,3,1,""],mkdir:[4,3,1,""]},"velstor.restapi.service":{shutdown:[4,3,1,""]},"velstor.restapi.session":{Session:[4,4,1,""]},"velstor.restapi.vp":{"delete":[4,3,1,""],find:[4,3,1,""],get:[4,3,1,""]},"velstor.restapi.workspace":{"delete":[4,3,1,""],get:[4,3,1,""],list:[4,3,1,""],set:[4,3,1,""]},velstor:{libtest:[2,0,0,"-"],libutil:[2,0,0,"-"],pcapi:[3,0,0,"-"],restapi:[4,0,0,"-"]}},objnames:{"0":["py","module","Python module"],"1":["py","exception","Python exception"],"2":["py","attribute","Python attribute"],"3":["py","function","Python function"],"4":["py","class","Python class"],"5":["py","method","Python method"]},objtypes:{"0":"py:module","1":"py:exception","2":"py:attribute","3":"py:function","4":"py:class","5":"py:method"},terms:{"0o755":3,"2fa":11,"2fdirectori":11,"2fmoon":11,"2fmy":11,"2fnew":11,"2fsilver":11,"2fworkspac":11,"byte":3,"case":[6,11],"class":[2,3,4,10],"default":[2,3,10,18,20,23],"export":[6,10,15,18,19,20],"final":4,"function":[2,4,26],"import":10,"int":[2,3,4,10],"new":[3,4,7,11],"return":[2,3,4,9,10,11],"short":3,"static":[9,12,16],"throw":2,"true":[2,3,4],"while":11,For:11,His:22,IDE:[10,14],IDEs:31,One:[2,3,7],That:7,The:[2,3,4,6,7,8,9,10,11,12,13,14,15,16,18,19,20,24,25,26,30,31],Then:7,There:[18,19,20,23],Use:[7,10,14],Using:[18,19,31],VPs:3,_build:[12,16],_cursor:11,_cwd:10,_set_up_virtualenv:12,_vtrq_path:10,abest:28,about:[4,9,11,25,31],abov:[13,16],absolut:[2,3,10],accept:[4,11],access:3,accordingli:23,account:[0,18,19],activ:[7,12,15,16,18,19,20],add:[13,16],added:11,addit:2,adducti:22,administr:31,adsciscunt:28,aedificia:28,after:[11,13,16,18,20],against:6,agri:28,agro:34,agrum:28,airbnb:10,alia:[3,24],align:23,all:[8,9,10,11,14,23],allobrogibu:[29,34],allobrogum:[29,34],alp:34,alreadi:[11,23],also:[6,18,20,23],altern:[18,19,20],alterum:29,altissimu:29,alwai:[2,3,10,11],amicitiam:22,analyz:14,angustia:34,angustum:29,ani:[9,10,14,18,20],animo:29,annot:10,answer:10,api:[2,3,4,7,18,20,24,25,31],appear:[13,16],appli:11,appropri:[2,4,6],apr:29,aquileiam:34,arbitrantur:28,arbitrati:28,architectur:31,arg:[2,10],argument:[2,3,4],armi:28,artifact:18,assign:23,assum:[2,7],asynchron:4,atqu:29,attribut:2,auctorit:22,autem:29,autobuild:[15,18,19,20],automag:[13,16],automat:2,autoreconf:[8,18,19,20],autotool:[6,8,18,19,20],avail:[25,31],awri:3,background:[10,26],base:[2,3,4],bash:[18,20],bash_complet:[6,15,18,19,20],bashrc:[15,18,19,20],basic:7,becaus:[8,11,18,19,20],been:[6,18,19,20,23,32,33,34],befor:11,begin:[11,18,19,20],below:[3,10],between:3,bewild:23,bin:[6,7,12,15,16,18,19,20,24],bind:[18,19],bit:[18,20],blog:11,bodi:[2,4,11],boilerpl:3,boiosqu:28,bono:29,bool:[2,3,4],boost:6,box:14,branch:[13,16],brief:2,browser:[9,26],build:[13,15,23,26,31],buildabl:10,built:[8,18,19,20],bundl:[15,18,19,20],call:[2,3,4,6,8,11,18,19,20],callabl:4,callback:4,calledprocesserror:2,can:[2,7,9,18,20,23],capabl:10,carri:29,carrorum:22,caturig:34,caus:[18,19],causa:[27,34],causam:27,cento:6,certain:4,ceutron:34,chain:14,chang:[7,23],charact:[2,10,14],check:[10,14,18,19,23,24],checkedoutputexcept:3,checkout:16,child:[3,4,11],children:[11,24],cibaria:28,circum:34,citeriori:34,civita:28,civitatibu:22,clear:14,client:[4,18,20],clone:[3,18,19],cmd:2,coacturo:29,code:[2,3,4,10,14,25,31],coegerunt:27,coegit:27,coemer:22,coger:28,collect:11,com:2,comburunt:28,come:6,command:[2,10,18,20,26],comment:14,commit:[13,16],commonequalitymixin:[2,3,10],comparar:22,comparati:29,compat:[18,19],complet:[4,18,20],compluribu:34,compon:[3,31],compris:[11,18,20,25],comput:2,conantur:[28,34],conaretur:28,conduxit:27,configur:[7,8,10,14,23,31],confirmar:22,conjunct:3,connect:[9,23,25],consciverit:28,conscribit:34,consequ:11,consid:6,consilio:28,constituer:28,constituerunt:22,constituta:27,constructor:3,consulibu:29,contain:[4,8],contendit:34,content:[1,31,32,33,34],context:[18,19],contextu:3,continu:10,conveni:[3,4,29],convent:5,convert:4,copi:[3,4,11,23],copia:[22,34],copy_vector:4,correctli:[6,18,20],correspond:2,creat:[2,3,4,6,7,11],create_workspac:2,create_workspace_vtrq:2,cremaretur:27,cum:[22,28,34],current:[6,10,18,19,20,23,24],cursor:11,custom:[6,18,19,20],cwd:[3,10],damnatum:27,dashboard:[18,20],data:[2,3,4,11,18,20,25],databas:[18,20],deal:[11,23],decem:27,def:10,definit:4,delet:[2,3,4,11],delete_workspace_vtrq:2,deliv:4,depend:[6,8,18,19,20,23],deploi:[18,20],deploy:[7,18,19,20],depot:[18,20],depth:2,describ:[3,10,11,12,13,16,18,20,23],descript:[2,14],dest:3,destin:[3,4],detail:[3,4,11],dev:5,develop:[6,9,10,14,23,26,31,32,33,34],dicer:27,diceret:27,dict:[2,3,4],dictionari:2,dictioni:27,dicunt:29,die:[27,29,34],diem:29,dies:29,differ:[7,11],difficil:29,dir:14,directli:31,directori:[2,3,4,6,7,8,9,10,11,12,13,14,16,18,19,20,23,25],dismount:4,displai:26,dispos:3,dist:9,distribut:[6,18,24],doc:[13,14,16,25],docstr:[10,14],document:[0,2,4,7,10,15,18,19,20,25,32,33,34],doe:[6,11,18,20],doesn:[3,25],doing:23,domo:[28,29],domum:28,done:[7,8,12,16,18,19,20],down:[4,6],drive:[0,18,19],duasqu:34,ducerentur:29,ducit:34,dummi:[18,20],duo:29,duodecim:28,dure:9,each:[2,3,4,6,18,19,20,23],eam:28,eas:34,editor:14,educit:34,eexist:3,effect:11,efferr:28,einbeck:7,either:4,eiu:28,element:11,elimin:23,elsewher:7,emploi:4,enabl:[14,18,20,23],encod:[2,11],end:11,endpoint:3,enforc:[10,31],enoent:3,ensu:14,ensur:[14,15,18,19,20],entiti:11,entri:2,enuntiata:27,environ:[7,9,12,16,25],eodem:[27,28],eorumqu:34,eos:[27,29],equal:2,equival:2,erant:[28,29],erat:[29,34],eripuit:27,errno:3,error:[2,3,4],error_sym:[2,3,24],es6:[10,14],eslint:[10,14],eslintrc:[10,14],ess:28,essent:28,est:[27,28,29,34],etc:[18,20,23],eventu:[4,7],everi:11,everyth:[6,11,23],exampl:[11,32,33,34],except:[1,2,14],exeant:28,exec:2,execut:[3,23],exercitum:34,exir:29,exist:[3,4],existimab:29,exit:2,expect:[4,18,20,23,24],expeditiu:29,explicit:[2,3],explicitli:[11,14],exsequi:28,extens:[8,18,19,20],extern:23,extra:34,extremum:[29,34],exusti:28,facer:[22,28],facil:29,faciliu:29,fail:4,fals:[2,3],familiam:27,familiar:[8,18,19,20],fecerat:34,file:[3,4,7,12,13,14,15,16,18,19,20,23],filesystem:[2,3],filter:4,find:[4,8,18,19,20],fine:[29,34],finibu:[28,29],finish:6,finitimi:28,firefox:25,firewal:7,first:[6,14],flow:[10,30],fluit:29,flumen:29,follow:[5,6,10,13,14,15,16,18,19,20,25,26],forc:3,foreground:[25,26],fork:[18,19],format:[10,14],found:11,four:10,framework:[7,14],from:[2,3,6,10,11,13,14,16,18,20,25],frqu:[6,8,15,18,19,20],frumenti:22,frumentum:28,fulfill202:[1,2],fulli:[4,32,33,34],fundament:11,gabinio:29,galliam:34,gather:6,gcc:6,genava:29,gener:[2,3,5,9,11,12,13,15,16,18,19,20],get:[3,4,10,11,23],getter:10,git:[13,16],github:[10,13,14,16,18,19,30,31],give:23,gnu:[18,19,20],goal:6,golden:[18,20],googl:[0,8,10,14,18,19],gracefulli:4,graioc:34,grand:[18,19,20],great:23,grid:[1,2,11],grunt:10,guid:10,gulp:10,gyp:[18,19],habebat:27,haeduorum:34,hand:11,hard:3,hardwir:[8,18,19,20],has:[4,10,11,18,19,20,23],hasn:[32,33,34],hateoa:11,have:[2,3,4,6,11,26],haven:23,head:5,header:[4,18,19,20],health:31,helvetii:[27,28,34],helvetio:29,helvetiorum:29,here:11,hiberni:34,hiemab:34,hierarch:[2,3,10],hierarchi:4,high:3,hint:10,his:34,hominum:[27,28],host:[4,10],hostnam:4,hous:[18,19,20],how:[18,20],howev:23,html:[9,12,16],http:[2,3,4,5,11,25],http_code:3,http_statu:[2,4],iam:[28,34],ibi:34,idea:[10,11],idempot:11,identif:3,identifi:[2,3,4],igni:27,ignor:3,iis:28,immedi:11,impendebat:29,implement:4,impli:14,incendunt:28,incitata:28,includ:[3,25],incoluer:28,ind:34,indent:[10,14],independ:[18,19,20],index:[12,16],indicium:27,inform:[2,3,4,10,11,31],initi:3,insid:[7,9],inspect:14,instal:[8,9,14,15,21,23],instanc:[3,23],instead:[18,20],instruct:23,integ:[2,4,11],integr:14,inter:29,interact:25,interfac:[3,4,18,20,25],intermedi:3,intern:7,interpret:[8,14],interv:4,invoc:2,invok:[2,4],involv:[18,19],ips:[28,34],ire:[29,34],is_priv:[2,3],isqu:29,issu:4,italiam:34,iter:[4,34],itiner:[22,34],itinera:29,itineribu:[29,34],its:[3,8,10,18,19,20],iubent:28,iudicium:27,iumentorum:22,iuram:29,ius:28,javascript:[8,9,14,18,19,20],jetbrain:10,job:[4,11],jobid:4,json:[2,3],jsx:14,kal:29,kei:[2,4],keyword:[2,3,10],known:11,kwarg:[2,3,10],labienum:34,languag:[10,14],laptop:[18,19,20],latest:[6,13,16],latobrigi:28,launch:23,leaf:4,leap42:[6,18,20,23],leap:6,left:11,legatum:34,legion:34,legionibu:34,length:2,level:[3,18,19,20,26],librari:[2,3,4,6,18,19,20],libtest:1,libutil:[1,3],lightweight:[18,19,20],like:[2,4],line:[2,10,18,20],link:[6,18,19],lint:14,linux:2,list:[2,3,4,24],listen:23,live:3,load:[6,15,18,19,20,26],local:[2,3,18,20,23],localhost:[23,25],loci:[29,34],login:4,look:[2,4],lot:26,machin:[18,19],magistratu:28,magni:34,magnum:27,mai:[4,10,12,16,18,19,23,31],maintain:[0,10,18,19],make:[3,6,8,12,13,16,18,19,20,25],manag:[0,4,6,7,18,19,31],mani:11,manipul:11,map:[2,3,10],margin:10,master:[13,16],mastiff:7,match:4,maxima:22,maximum:22,mean:4,mensum:28,messag:[2,24],meta:[3,4,11],meta_copi:11,metadata:10,method:14,milia:27,minifi:9,minimum:6,minu:28,miss:3,mkdir:[3,4,6,8,18,19,20],mkfile:3,mode:[3,4,14],model:11,modifi:[6,11,24],modul:1,molita:28,mon:29,monitor:31,montem:29,moon:11,more:[4,11,32,33,34],moribu:27,mortem:28,mortuu:28,most:23,mount:[1,2,4],mount_point:[3,4],mount_vp:2,move:[7,25],msg:2,multitudinemqu:28,multo:29,munitioni:34,must:[7,8,10,12,16,18,19,20],name:[2,3,4,7,10],namespac:[1,2,11,24],napoleon:10,navig:14,necessari:4,need:[6,9,11,14,15,18,19,20,23],nequ:28,never:[2,3],nick:7,nihilo:28,node:[3,4,6,8,9,11,14,26],node_gyp:[8,18,19,20],node_modul:[10,14],non:[2,29],nondum:29,none:[3,4,10],noreiamqu:28,noricum:28,nostram:29,note:2,now:[6,13,16],npm:[9,10,14,18,19,20,21,25,26],nulli:29,number:[2,23],numero:28,numerum:[22,27],nuper:29,nvm:[6,15,18,19,20],nvm_dir:[6,15,18,19,20],obaeratosqu:27,obj:2,object:[2,3,4,18,19,20],obtain:[6,20,23],occupati:34,ocelo:34,off:14,omn:[27,28,29],omnem:27,omnia:28,omnibu:29,omnino:29,onc:[11,18,19,20],one:[4,7,23],onli:[2,4,10,14,18,20],onto:6,opaqu:4,open:[9,31],oper:2,oportebat:27,oppida:28,oppidi:28,oppido:29,oppidum:[29,34],oppugnab:28,opt:[6,8,15,18,19,20,23,24],optim:9,option:[2,3,10],org:5,orgetoricem:27,orgetorigi:22,orgetorix:[27,28],orient:3,origin:[13,16],other:[10,18,20,23],otherwis:[2,3,4,11],our:6,out:[32,33,34],output:2,overflow:10,overview:10,overwrit:[3,4],overwritten:[3,4],pacati:29,pacem:22,packag:[1,14],page:[13,16,26],pair:[4,10],paramet:[2,3,4,10],paratior:28,parato:28,parent:[3,4],parenthes:10,part:[6,11],particular:[14,18,20],pass:[2,3,4,11],paterentur:29,path:[2,3,4,6,10,11],pathnam:[3,10],pattern:6,pcapi:[1,2],peercach:[3,4,6,11,24,31],pend:4,pep:[5,10],per:[10,27,29,34],perfectli:26,perforc:[18,20],perform:[4,10,11,14,26,31],pericula:28,perman:4,permoti:22,perpauci:29,persuad:28,persuasuro:29,pertiner:22,pertinet:29,pervener:34,pervenit:34,pic:[8,18,19,20],pidl:2,pip:[7,15,18,19,20],pison:29,place:[9,11,13,15,16,18,19,20],platform:6,pleas:[0,18,19],poenam:27,point:[2,3,7,9,14],polici:31,poll:4,pon:29,populabantur:34,populum:29,port:[18,20,23],portaturi:28,portion:[11,18,19,20],possent:29,post:[4,28],praeficit:34,praeter:28,prefer:14,prefix:2,prepar:[25,31],present:3,primi:34,privat:[3,24],privata:28,probabl:25,problem:[2,18,19],proce:[18,19,20],procedur:18,process:[2,9,10,18,19,24,25],produc:[9,11,18,19],product:[6,9,18,19,26],proelii:34,profectionem:29,proficiscantur:28,proficiscendum:22,program:[6,18,20,25],prohiber:[29,34],project:[7,8,9,10,12,14,16,18,19,20,30],properti:10,propterea:29,protocol:4,provid:[3,4,6,14,18,19,20],provincia:34,provinciam:[29,34],proximi:22,proximum:34,proximumqu:29,publish:[10,31],pull:16,pulsi:34,push:[13,16],put:[3,6,18,20],pytest:7,python3:[7,15,18,19,20],python:[2,5,7,12,14,16,24,31],qua:[29,34],quadringento:28,quae:[22,34],qualifi:4,qualiti:14,quam:[22,34],quemqu:28,qui:[28,29],quibu:29,quin:28,quinqu:34,quod:[28,29,34],quorum:27,rais:[2,3],raise_if_not_2xx:3,random:2,random_identifi:2,random_path:2,randomli:2,rauraci:28,react:[10,14],read:3,readi:6,real:[18,20],rebu:[22,29],receiv:[3,4],recepto:28,recommend:10,recurs:[3,4],reditioni:28,reduc:3,refer:[0,10,11,18,19,23],releas:[6,18,19,20],reli:6,reliqua:28,rem:28,remov:[3,4],repositori:[14,18,19,20],repres:[3,4,10,11],represent:[3,11],request:[2,3,4,11],requir:[7,10,14],res:27,resourc:11,respect:6,respond:4,respons:[2,3,4],rest:[2,3,4,14,18,19,20,23,25],restapi:[1,2],restexcept:3,result:[4,9,24],retriev:[3,4],returncod:2,rhenum:28,rhodani:29,rhodanu:29,rhodanum:[29,34],ripam:29,romanum:29,root:[3,7,12,14,16,23,24],rout:11,rpc:2,rpc_status_to_http_statu:2,run:[2,6,7,9,14,19,31],same:[6,11],sampl:23,sampler:[18,20,25],saniti:[18,19,24],script:[7,9,10,23],second:[4,6],section:[5,11,14,23,32,33,34],secum:28,secur:[3,4,10,31],see:[2,10,32,33,34],segusiavo:34,self:10,semant:[2,3,4],sement:22,sent:[11,18,20],separ:[18,19,20],septimo:34,sequano:29,sequanorum:34,sequi:27,serv:[9,18,20],servc:23,server:[2,3,4,6,9,11,23,26,31],servic:[1,2,18,20],sese:29,session:[1,2,3,10],set:[3,4,10,14,31],setter:10,share:[18,20,23],shell:7,should:23,shut:4,shutdown:4,sibi:28,silent:10,silver:11,similar:10,simpl:[2,7],simplest:24,singl:[2,4,8,11,14],singuli:29,site:9,situat:6,size:3,skip:4,socio:28,softwar:[6,9,15,26],some:[11,14],someth:3,sourc:[2,3,4,7,12,13,15,16,20,31],space:10,spawn:26,spe:28,spec:[2,4,25],specif:[2,3,4,11,18,19],specifi:[3,11,31],sphinx:[12,15,16,18,19,20],sphinx_rtd_them:[15,18,19,20],src:3,stack:10,stackoverflow:2,standard:10,start:[9,18,20,21,23,25,26],stat:3,state:11,statu:[2,3,4,23],status_cod:2,stdout:2,store:3,str:[2,3,4,10],strict:14,string:[2,3,4],structur:2,style:[10,14],sua:[28,34],suam:27,subdirectori:3,subeunda:28,sublata:28,submodul:1,subpackag:1,subprocess:2,subsystem:14,subtre:4,successfulli:23,sudo:[15,18,19,20],suffici:[6,11,18,20],sui:[27,28],suit:[18,19,20],sunt:[28,34],suo:[27,29],superioribu:34,suppeteret:22,suse:6,suspicio:28,suum:28,symbol:[2,6,18,19],sync:[18,20],synchron:4,synthetic_respons:2,system:[2,3,4,7,15,18,19,20,23,31],systemctl:[18,20,23],systemd:[18,20,23],tab:[10,14],take:[4,11,25],talk:[3,9,25],target:[6,9,18,20,23],tbd:[3,15,18,19],term:11,test:[18,19,20,23],test_san:7,than:[4,11],thei:10,them:23,thi:[3,4,6,7,9,10,11,14,15,18,19,20,23,25,31,32,33,34],three:23,ties:[18,19,20],time:[4,6,18,20],tip:14,tmp:[18,20],todo:2,togeth:[6,18,19,20],token:2,tool:[14,18,20],toolroot:[8,14,15,18,19,20,23],top:[7,18,19,20],traduxer:34,tran:[28,34],transfer:11,transier:28,transit:11,transitur:29,tre:34,tricki:23,trickl:[2,3],trium:28,tulingi:28,tunnel:11,turn:14,two:[2,4,6,8,10,11,18,20,23,25],txt:7,type:[2,3,4,10],ubi:28,ulteriorem:34,ulteriori:34,una:28,under:[11,12,14,16],undiqu:27,unexpect:[2,3],unholi:3,unifi:[18,19,20],univers:11,unmount:[2,3],unmount_vp:2,unpack:[2,6],unpack_respons:2,unum:29,updat:[13,16],upgrad:[15,18,19,20],url:[2,4,11,25],urlencod:2,use:[3,6,7,10,11,14,18,19,20,23],used:3,useful:10,uses:[6,7,10,11,15,18,19,20,30],usi:28,using:[2,6,9,10,15,18,19,20,23],usual:[18,19,20],uti:28,vado:29,valid:[2,10,26],valu:[2,3,4],valueerror:[2,3],vclc:[2,25,31],vclcerror:2,vcnc:[2,3,4,6,10,11,13,14,15,16,23,30],vda:25,vel:29,velstor:[1,6,18,19,20,23,24],venv:[7,12,15,16,18,19,20],verb:11,verifi:7,version:[6,7,14],vicisqu:28,vico:28,viderentur:29,view:[12,16],vinculi:27,virtual:[7,12,16],virtualenv:[15,18,19,20],vix:29,vocontiorum:34,volum:[1,2],vp_host:4,vpid:4,vpm:[23,25],vps:23,vtrq:[2,3,4,10,24,25],vtrq_id:[2,3,4,10,23],vtrq_path:[2,3,10],vtrqid:4,wai:[8,11,18,19,20,23,24],want:[6,18,20,25],web:[10,14,18,20,31],websit:[12,16],webstorm:10,well:14,went:3,were:9,when:[3,4,6,9,11,18,20],whenev:7,where:[3,10],which:[2,3,4,6,9,11,14,25],who:6,whole:11,whose:[2,11],window:9,wish:[10,11],within:3,without:[11,18,20],won:25,work:[3,6,10,18,20,32,33,34],workflow:31,worksapc:4,workspac:[1,2,10,11,23],workspace_nam:4,workspace_pathnam:2,workstat:[6,18,19,20],would:11,wrap:9,write:3,writeback:[2,3],written:[15,18,19,20,32,33,34],www:5,yast:6,yet:[32,33,34],you:[6,15,18,19,20,23,24,25],your:[6,7,10,15,18,19,20,23],zero:2},titles:["vCNC Architecture","api-python","velstor package","velstor.pcapi package","velstor.restapi package","About this Document","Preparing to Build","Building <em>vclc</em>","Building <em>vcnc-server</em>","Building <em>vcnc-web</em>","Policies","Design Notes","Building this document","Publishing this Document","IDEs","Configuring the Development Environment","Building this documentation","Building <em>vclc</em> and the Python API","Installing and Building <em>vcnc-server</em>","External Builds","Internal Builds","Building <em>vcnc-web</em>","Python API","Preparing to Run","Running <em>vclc</em>","Running <em>vcnc-server</em>","Running <em>vcnc-web</em>","vCLC (Command Line Client)","vCNC REST","vCNC Web","Workflow","vCNC documentation","Getting Started","Users and Security","vCNC Clients"],titleterms:{IDEs:[10,14],about:5,administr:34,api:[1,11,17,22,34],architectur:0,build:[6,7,8,9,12,16,17,18,19,20,21],client:[27,34],command:[27,34],configur:[6,15,18,19,20],content:[2,3,4],control:10,convent:11,design:11,develop:[7,15,18,19,20],document:[5,12,13,16,31],endpoint:11,environ:[6,15,18,19,20],except:3,explor:34,extend:11,extern:[6,18,19],from:23,fulfill202:4,gener:10,get:32,gnu:6,grid:4,hierarch:11,instal:[6,7,18,19,20],intern:[6,18,20],javascript:10,libtest:2,libutil:2,line:[27,34],modul:[2,3,4],mount:3,name:11,namespac:[3,4],node:[10,15,18,19,20],note:11,obtain:[18,19],oper:11,packag:[2,3,4,7],pcapi:3,peercach:[18,19,20,23],plural:11,polici:10,post:11,prepar:[6,23],product:23,publish:[13,16],put:11,python:[1,10,15,17,18,19,20,22],redi:[18,20,23],releas:23,rest:[11,28,34],restapi:4,rethinkdb:[18,20,23],run:[18,20,21,23,24,25,26],secur:33,server:[8,18,19,20,25],servic:[4,23],session:4,set:7,singular:11,softwar:[18,19,20],sourc:[18,19],stack:[28,29],start:32,submodul:[2,3,4],subpackag:2,technolog:[28,29],test:7,thi:[5,12,13,16],tool:6,toolroot:6,triptych:23,user:33,vclc:[7,17,24,27],vcnc:[0,8,9,18,19,20,21,25,26,28,29,31,34],velstor:[2,3,4],verifi:23,version:10,virtualenv:7,vnc:[18,19,20],volum:3,vtrq:[11,23],web:[9,21,26,29,34],webstorm:14,workflow:30,workspac:[3,4]}})