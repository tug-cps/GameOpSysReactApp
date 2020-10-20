(this["webpackJsonpgameopsys-react-app"]=this["webpackJsonpgameopsys-react-app"]||[]).push([[0],{201:function(e,t,a){e.exports=a(323)},206:function(e,t,a){},232:function(e,t){},234:function(e,t){},245:function(e,t){},247:function(e,t){},274:function(e,t){},276:function(e,t){},277:function(e,t){},283:function(e,t){},285:function(e,t){},303:function(e,t){},305:function(e,t){},317:function(e,t){},320:function(e,t){},323:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(13),c=a.n(o),i=a(82),l=a(16),s=a(189),u=a(377),m=(a(206),a(354)),p=a(356),h=a(357),d=a(358),f=a(72),v=a(360),b=a(361),E=a(362),g=a(363),y=a(364),k=a(365),O=a(351),j=a(359),w=Object(O.a)((function(e){return{card:{borderColor:e.palette.secondary.main},root:{flexGrow:1},media:{minHeight:120,backgroundColor:e.palette.secondary.main},largeIcon:{fontSize:"8em"},title:{flexGrow:1}}}));var C=function(){var e=w();return r.a.createElement(r.a.Fragment,null,r.a.createElement(b.a,{position:"sticky"},r.a.createElement(E.a,null,r.a.createElement(f.a,{variant:"h6",className:e.title},"GameOpSysApp"),r.a.createElement(g.a,{color:"inherit",href:"/logout"},"Logout"))),r.a.createElement(y.a,{component:"main",maxWidth:"lg",disableGutters:!0,className:e.root},r.a.createElement(k.a,null),r.a.createElement(m.a,{container:!0,spacing:1},[{title:"Upload",subtitle:"Upload energy consumption",icon:"cloud_upload",destination:"/upload",header:!1},{title:"Behavior",subtitle:"My daily prediction",icon:"edit",destination:"/behavior",header:!1},{title:"Power",subtitle:"My accuracy",icon:"show_chart",destination:"/power",header:!1},{title:"Archive",subtitle:"My previous predictions",icon:"history",destination:"/archive",header:!1},{title:"Surveys",subtitle:"My surveys",icon:"assignment",destination:"/survey",header:!1},{title:"My Data",subtitle:"Edit my data",icon:"person",destination:"/user",header:!1}].map((function(t){return r.a.createElement(m.a,{item:!0,xs:t.header?12:6,xl:t.header?12:4,key:t.title},r.a.createElement(p.a,{variant:"outlined",className:e.card},r.a.createElement(h.a,{href:t.destination},r.a.createElement(d.a,{className:e.media},r.a.createElement(f.a,{align:"center"},r.a.createElement(j.a,{className:e.largeIcon,style:{color:"#fff"}},t.icon))),r.a.createElement(v.a,null,r.a.createElement(f.a,{variant:"h6"},t.title),r.a.createElement(f.a,{color:"textSecondary",noWrap:!0},t.subtitle)))))})))))},x=a(14),S=a(15),N=a(34),I=a(18),B=a(17),G=a(382),P=a(383),W=a(378),D=a(4),z=a(33),F=a(11),T=a.n(F),U=a(24),M=a(184),_=a.n(M).a.create({baseURL:"https://it035137.uni-graz.at:443/v2/"}),R=function(){function e(){Object(x.a)(this,e),this.accessToken=void 0,this.email=void 0,this.isLoggedIn=void 0,this.accessToken=localStorage.getItem("token")||"",this.email=localStorage.getItem("email")||"",this.isLoggedIn=""!==this.accessToken}return Object(S.a)(e,[{key:"requestPin",value:function(){var e=Object(U.a)(T.a.mark((function e(t,a){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return localStorage.setItem("email",a),e.abrupt("return",this.get("/request_pin",{params:{shared_password:t,email:a}}).then((function(){localStorage.setItem("email",a)})));case 2:case"end":return e.stop()}}),e,this)})));return function(t,a){return e.apply(this,arguments)}}()},{key:"login",value:function(){var e=Object(U.a)(T.a.mark((function e(t){var a,n=this;return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=localStorage.getItem("email"),e.abrupt("return",this.get("/login",{params:{email:a,password:t}}).then((function(e){localStorage.removeItem("email");var t=e.data.token;n.accessToken=t,localStorage.setItem("token",t)})));case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"logout",value:function(){var e=Object(U.a)(T.a.mark((function e(){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return localStorage.removeItem("token"),e.abrupt("return",this.perform("/logout"));case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getUser",value:function(){var e=Object(U.a)(T.a.mark((function e(){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.get("/user").then((function(e){return e.data})));case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getConsumers",value:function(){var e=Object(U.a)(T.a.mark((function e(){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.get("/consumer").then((function(e){return e.data})));case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"putConsumer",value:function(){var e=Object(U.a)(T.a.mark((function e(t){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.put("/consumer/"+t.consumerId,null,{params:{consumer_name:t.name,consumer_active:t.active}}));case 1:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getProcessedConsumptions",value:function(){var e=Object(U.a)(T.a.mark((function e(){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.get("/processedconsumption").then((function(e){return e.data})));case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getProcessedConsumption",value:function(){var e=Object(U.a)(T.a.mark((function e(t){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.get("/processedconsumption/"+t).then((function(e){return e.data})));case 1:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getPredictions",value:function(){var e=Object(U.a)(T.a.mark((function e(){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.get("/predictions").then((function(e){return e.data})));case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getPrediction",value:function(){var e=Object(U.a)(T.a.mark((function e(t){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",this.get("/predictions/"+t).then((function(e){return e.data})));case 1:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"postConsumption",value:function(){var e=Object(U.a)(T.a.mark((function e(t){var a;return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(a=new FormData).append("upfile",t,t.name),e.abrupt("return",this.post("/consumption",a));case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"get",value:function(){var e=Object(U.a)(T.a.mark((function e(t,a){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",_.get(t,Object(z.a)(Object(z.a)({},a),{},{headers:{Authorization:"".concat(this.accessToken)}})));case 1:case"end":return e.stop()}}),e,this)})));return function(t,a){return e.apply(this,arguments)}}()},{key:"post",value:function(){var e=Object(U.a)(T.a.mark((function e(t,a,n){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",_.post(t,a,Object(z.a)(Object(z.a)({},n),{},{headers:{Authorization:"".concat(this.accessToken)}})));case 1:case"end":return e.stop()}}),e,this)})));return function(t,a,n){return e.apply(this,arguments)}}()},{key:"put",value:function(){var e=Object(U.a)(T.a.mark((function e(t,a,n){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",_.put(t,a,Object(z.a)(Object(z.a)({},n),{},{headers:{Authorization:"".concat(this.accessToken)}})));case 1:case"end":return e.stop()}}),e,this)})));return function(t,a,n){return e.apply(this,arguments)}}()},{key:"perform",value:function(){var e=Object(U.a)(T.a.mark((function e(t,a){return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",_({method:"get",url:t,params:a,headers:{Authorization:"".concat(this.accessToken)},responseType:"json"}).then((function(e){return e.data?e.data:[]})));case 1:case"end":return e.stop()}}),e,this)})));return function(t,a){return e.apply(this,arguments)}}()}]),e}(),L=new R,A=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(e){var n;return Object(x.a)(this,a),(n=t.call(this,e)).state={shared_password:"",email:""},n.handleSubmit=n.handleSubmit.bind(Object(N.a)(n)),n}return Object(S.a)(a,[{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),console.log("onSubmit!!!"),L.requestPin(this.state.shared_password,this.state.email).then((function(){t.props.history.push("/verify")}))}},{key:"render",value:function(){var e=this,t=this.props.classes;return r.a.createElement(y.a,{component:"main",maxWidth:"xs"},r.a.createElement(k.a,null),r.a.createElement("div",{className:t.paper},r.a.createElement(P.a,{className:t.avatar}),r.a.createElement(f.a,{component:"h1",variant:"h5"},"Sign in"),r.a.createElement("form",{className:t.form,onSubmit:this.handleSubmit},r.a.createElement(W.a,{id:"shared_password",label:"Shared password",variant:"outlined",margin:"normal",value:this.state.shared_password,onChange:function(t){return e.setState({shared_password:t.target.value})},required:!0,fullWidth:!0}),r.a.createElement(W.a,{autoComplete:"email",id:"email",label:"Email address",variant:"outlined",margin:"normal",value:this.state.email,onChange:function(t){return e.setState({email:t.target.value})},required:!0,fullWidth:!0}),r.a.createElement(g.a,{type:"submit",fullWidth:!0,variant:"contained",color:"primary",className:t.submit},"Send verification code"))))}}]),a}(r.a.Component),q=Object(D.a)((function(e){var t=e.palette,a=e.spacing;return Object(G.a)({paper:{marginTop:a(8),display:"flex",flexDirection:"column",alignItems:"center"},avatar:{margin:a(1),backgroundColor:t.secondary.main},form:{width:"100%",marginTop:a(1)},submit:{margin:a(3,0,2)}})}))(A);var H=function(){var e=Object(l.g)();return L.logout().finally((function(){e.push("/login")})),r.a.createElement("div",null)},J=a(190),Y=function(e){var t=e.component,a=Object(J.a)(e,["component"]),r=L.isLoggedIn;return n.createElement(l.b,Object.assign({},a,{render:function(e){return r?n.createElement(t,e):n.createElement(l.a,{to:{pathname:"/login",state:{from:e.location}}})}}))},Z=a(368),K=a(367),Q=a(369),V=a(380),X=a(28),$=a.n(X),ee=a(185),te=a.n(ee),ae=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(e){var n;return Object(x.a)(this,a),(n=t.call(this,e)).state={open:!1},n.onFormUpload=n.onFormUpload.bind(Object(N.a)(n)),n.handleClose=n.handleClose.bind(Object(N.a)(n)),n}return Object(S.a)(a,[{key:"onFormUpload",value:function(e){var t=this;null!=e.target&&null!=e.target.files&&L.postConsumption(e.target.files[0]).then((function(){console.log("File uploaded."),t.setState({open:!0})}))}},{key:"handleClose",value:function(e,t){"clickaway"!==t&&this.setState({open:!1})}},{key:"render",value:function(){var e=this,t=this.props.classes;return r.a.createElement("div",null,r.a.createElement(b.a,{position:"sticky"},r.a.createElement(E.a,null,r.a.createElement(Z.a,{edge:"start",className:t.menuButton,color:"inherit","aria-label":"back",onClick:function(){return e.props.history.go(-1)}},r.a.createElement($.a,null)),r.a.createElement(f.a,{variant:"h6",className:t.title},"Upload"))),r.a.createElement(y.a,{maxWidth:"md"},r.a.createElement(m.a,{container:!0,spacing:3},r.a.createElement(m.a,{item:!0,xs:12,sm:6},r.a.createElement(f.a,{variant:"h5",gutterBottom:!0},"1. Download most recent data"),r.a.createElement(f.a,{color:"textSecondary",paragraph:!0},"Please select your network operator to download the most recent consumption data"),r.a.createElement(K.a,null,[{name:"Netz Ober\xf6sterreich",link:"https://netz-online.netzgmbh.at/eServiceWeb/main.html"},{name:"Netz Burgenland",link:"https://smartmeter.netzburgenland.at"},{name:"K\xe4rnten Netz",link:"https://meinportal.kaerntennetz.at/meinPortal/Login.aspx?service=verbrauch"}].map((function(e){return r.a.createElement(Q.a,{key:e.name},r.a.createElement("a",{href:e.link},e.name))})))),r.a.createElement(m.a,{item:!0,xs:12,sm:6},r.a.createElement(f.a,{variant:"h5",gutterBottom:!0},"2. Upload your consumption"),r.a.createElement(f.a,{color:"textSecondary",paragraph:!0},"Please upload the file with the most recent consumptions here"),r.a.createElement("input",{accept:"*/*",className:t.input,id:"input-file",type:"file",onChange:this.onFormUpload}),r.a.createElement("label",{htmlFor:"input-file"},r.a.createElement(g.a,{variant:"contained",color:"primary",fullWidth:!0,component:"span"},"Upload"))))),r.a.createElement(V.a,{anchorOrigin:{vertical:"bottom",horizontal:"left"},open:this.state.open,autoHideDuration:6e3,onClose:this.handleClose,message:"File uploaded",action:r.a.createElement(r.a.Fragment,null,r.a.createElement(Z.a,{size:"small","aria-label":"close",color:"inherit",onClick:this.handleClose},r.a.createElement(te.a,{fontSize:"small"})))}))}}]),a}(r.a.Component),ne=Object(D.a)((function(e){return Object(G.a)({menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1},input:{display:"none"}})}))(ae),re=a(370),oe=a(371),ce=a(372),ie=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(e){var n;return Object(x.a)(this,a),(n=t.call(this,e)).state={user:{userId:"",email:"",type:"",creationDate:"",unlockDate:"",treatmentGroup:""},consumersCount:0},n}return Object(S.a)(a,[{key:"componentDidMount",value:function(){var e=this;L.getUser().then((function(t){return e.setState({user:t})})),L.getConsumers().then((function(t){return e.setState({consumersCount:t.length})}))}},{key:"render",value:function(){var e=this,t=this.props.classes;return r.a.createElement("div",{className:t.root},r.a.createElement(b.a,{position:"sticky"},r.a.createElement(E.a,null,r.a.createElement(Z.a,{edge:"start",className:t.menuButton,color:"inherit","aria-label":"back",onClick:function(){return e.props.history.go(-1)}},r.a.createElement($.a,null)),r.a.createElement(f.a,{variant:"h6",className:t.title},"User"))),r.a.createElement(y.a,{maxWidth:"md"},r.a.createElement(K.a,null,r.a.createElement(Q.a,null,r.a.createElement(re.a,null,r.a.createElement(j.a,null,"email")),r.a.createElement(oe.a,null,this.state.user.email)),r.a.createElement(Q.a,null,r.a.createElement(re.a,null,r.a.createElement(j.a,null,"power")),r.a.createElement(oe.a,null,this.state.consumersCount," consumers")),r.a.createElement(Q.a,null,r.a.createElement(re.a,null,r.a.createElement(j.a,null,"group")),r.a.createElement(oe.a,null,this.state.user.treatmentGroup)),r.a.createElement(Q.a,null,r.a.createElement(re.a,null,r.a.createElement(j.a,null,"access_time")),r.a.createElement(oe.a,null,"Created at ",this.state.user.creationDate)),r.a.createElement(Q.a,null,r.a.createElement(re.a,null),r.a.createElement(oe.a,null,"Unlocked at ",this.state.user.unlockDate)),r.a.createElement(Q.a,null,r.a.createElement(re.a,null),r.a.createElement(oe.a,null,"Finished at")))),r.a.createElement(ce.a,{variant:"extended",color:"primary",className:t.fab,href:"/consumers"},r.a.createElement(j.a,{className:t.extendedIcon},"edit"),"Edit consumers"))}}]),a}(r.a.Component),le=Object(D.a)((function(e){e.palette;var t=e.spacing;return Object(G.a)({root:{flexGrow:1},fab:{position:"absolute",bottom:t(2),right:t(2)},extendedIcon:{marginRight:t(1)},menuButton:{marginRight:t(2)},title:{flexGrow:1}})}))(ie),se=a(186);function ue(e){var t=e.treatmentGroup,a=se.createHash("md5").update(e.email).digest("hex");return[{title:"Survey 1",destination:"https://ww3.unipark.de/uc/SOZPSY/7a37/?a=".concat(a,"&b=").concat(t)},{title:"Final survey",destination:"https://ww3.unipark.de/uc/SOZPSY/96f2/?a=".concat(a,"&b=").concat(t)}]}var me=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(e){var n;return Object(x.a)(this,a),(n=t.call(this,e)).state={items:[]},n}return Object(S.a)(a,[{key:"componentDidMount",value:function(){var e=this;L.getUser().then((function(t){return e.setState({items:ue(t)})}))}},{key:"render",value:function(){var e=this,t=this.props.classes;return r.a.createElement(r.a.Fragment,null,r.a.createElement(b.a,{position:"sticky"},r.a.createElement(E.a,null,r.a.createElement(Z.a,{edge:"start",className:t.menuButton,color:"inherit","aria-label":"back",onClick:function(){return e.props.history.go(-1)}},r.a.createElement($.a,null)),r.a.createElement(f.a,{variant:"h6",className:t.title},"Surveys"))),r.a.createElement(y.a,{component:"main",maxWidth:"lg",disableGutters:!0},r.a.createElement(k.a,null),r.a.createElement(m.a,{container:!0,spacing:1},this.state.items.map((function(e){return r.a.createElement(m.a,{item:!0,xs:6,xl:4,key:e.destination},r.a.createElement(p.a,{variant:"outlined",className:t.card},r.a.createElement(h.a,{href:e.destination},r.a.createElement(d.a,{className:t.media},r.a.createElement(f.a,{align:"center"},r.a.createElement(j.a,{className:t.largeIcon,style:{color:"#fff"}},"assignment"))),r.a.createElement(v.a,null,r.a.createElement(f.a,{variant:"h6"},e.title),r.a.createElement(f.a,{color:"textSecondary",noWrap:!0},"Please fill out this survey")))))})))))}}]),a}(r.a.Component),pe=Object(D.a)((function(e){return Object(G.a)({card:{borderColor:e.palette.secondary.main},root:{flexGrow:1},media:{minHeight:120,backgroundColor:e.palette.secondary.main},largeIcon:{fontSize:"8em"},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1}})}))(me),he=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(e){var n;return Object(x.a)(this,a),(n=t.call(this,e)).state={password:""},n.handleSubmit=n.handleSubmit.bind(Object(N.a)(n)),n}return Object(S.a)(a,[{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),L.login(this.state.password).then((function(){t.props.history.push("/")}))}},{key:"render",value:function(){var e=this,t=this.props.classes;return r.a.createElement(y.a,{component:"main",maxWidth:"xs"},r.a.createElement(k.a,null),r.a.createElement("div",{className:t.paper},r.a.createElement(P.a,{className:t.avatar}),r.a.createElement(f.a,{component:"h1",variant:"h5"},"Sign in"),r.a.createElement("form",{className:t.form,onSubmit:this.handleSubmit},r.a.createElement(W.a,{id:"otp",label:"Pin",variant:"outlined",margin:"normal",value:this.state.password,onChange:function(t){return e.setState({password:t.target.value})},required:!0,fullWidth:!0}),r.a.createElement(g.a,{type:"submit",fullWidth:!0,variant:"contained",color:"primary",className:t.submit},"Log in"))))}}]),a}(r.a.Component),de=Object(D.a)((function(e){var t=e.palette,a=e.spacing;return Object(G.a)({paper:{marginTop:a(8),display:"flex",flexDirection:"column",alignItems:"center"},avatar:{margin:a(1),backgroundColor:t.secondary.main},form:{width:"100%",marginTop:a(1)},submit:{margin:a(3,0,2)}})}))(he),fe=a(116),ve=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(e){var n;return Object(x.a)(this,a),(n=t.call(this,e)).state={data:[]},n}return Object(S.a)(a,[{key:"componentDidMount",value:function(){var e=this;L.getProcessedConsumption(this.props.date).then((function(t){e.setState({data:t.map((function(e){return e.data.map((function(t,a){return{type:e.type,time:a,value:t}}))})).flat()})}))}},{key:"render",value:function(){return r.a.createElement(fe.Chart,{height:300,autoFit:!0,data:this.state.data},r.a.createElement(fe.LineAdvance,{shape:"smooth",point:!0,area:!0,position:"time*value",color:"type"}))}}]),a}(r.a.Component),be=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(e){var n;return Object(x.a)(this,a),(n=t.call(this,e)).state={dates:[]},n}return Object(S.a)(a,[{key:"componentDidMount",value:function(){var e=this;L.getProcessedConsumptions().then((function(t){return e.setState({dates:t})}))}},{key:"render",value:function(){var e=this,t=this.props.classes;return r.a.createElement("div",{className:t.root},r.a.createElement(b.a,{position:"sticky"},r.a.createElement(E.a,null,r.a.createElement(Z.a,{edge:"start",className:t.menuButton,color:"inherit","aria-label":"back",onClick:function(){return e.props.history.go(-1)}},r.a.createElement($.a,null)),r.a.createElement(f.a,{variant:"h6",className:t.title},"Power"))),r.a.createElement(y.a,{maxWidth:"md"},this.state.dates.map((function(e,a){return r.a.createElement(p.a,{variant:"outlined",key:e,className:t.card},r.a.createElement(h.a,{href:"/power/"+e},r.a.createElement(v.a,null,r.a.createElement(f.a,{variant:"h6"},e),r.a.createElement(ve,{date:e}))))}))))}}]),a}(r.a.Component),Ee=Object(D.a)((function(e){e.palette;var t=e.spacing;return Object(G.a)({root:{flexGrow:1},menuButton:{marginRight:t(2)},title:{flexGrow:1},card:{marginTop:t(2)}})}))(be),ge=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(e){var n;return Object(x.a)(this,a),(n=t.call(this,e)).state={predictions:[]},n}return Object(S.a)(a,[{key:"componentDidMount",value:function(){var e=this;L.getPrediction(this.props.date).then((function(t){return e.setState({predictions:t})}))}},{key:"render",value:function(){return r.a.createElement(p.a,{variant:"outlined"},r.a.createElement(h.a,{href:"/archive/"+this.props.date},r.a.createElement(v.a,null,r.a.createElement(f.a,{variant:"h6"},this.props.date),this.state.predictions.map((function(e){return r.a.createElement(f.a,{variant:"body1"},e.data.map((function(e){return e?"\u2588":"\u2591"})))})))))}}]),a}(r.a.Component),ye=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(e){var n;return Object(x.a)(this,a),(n=t.call(this,e)).state={dates:[]},n}return Object(S.a)(a,[{key:"componentDidMount",value:function(){var e=this;L.getPredictions().then((function(t){return e.setState({dates:t})}))}},{key:"render",value:function(){var e=this,t=this.props.classes;return r.a.createElement("div",{className:t.root},r.a.createElement(b.a,{position:"sticky"},r.a.createElement(E.a,null,r.a.createElement(Z.a,{edge:"start",className:t.menuButton,color:"inherit","aria-label":"back",onClick:function(){return e.props.history.go(-1)}},r.a.createElement($.a,null)),r.a.createElement(f.a,{variant:"h6",className:t.title},"Predictions"))),r.a.createElement(y.a,{maxWidth:"md"},this.state.dates.map((function(e,t){return r.a.createElement(ge,{date:e,key:e})}))))}}]),a}(r.a.Component),ke=Object(D.a)((function(e){var t=e.spacing;return Object(G.a)({root:{flexGrow:1},menuButton:{marginRight:t(2)},title:{flexGrow:1},card:{marginTop:t(2)}})}))(ye),Oe=a(373),je=a(381),we=a(374),Ce=a(375),xe=a(376),Se=a(187),Ne=a.n(Se),Ie=a(188),Be=a.n(Ie),Ge=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(e){var n;return Object(x.a)(this,a),(n=t.call(this,e)).state={consumers:[],open:!1,consumerName:""},n.refresh=n.refresh.bind(Object(N.a)(n)),n}return Object(S.a)(a,[{key:"refresh",value:function(){var e=this;L.getConsumers().then((function(t){return e.setState({consumers:t})}))}},{key:"componentDidMount",value:function(){this.refresh()}},{key:"render",value:function(){var e=this,t=this.props.classes,a=function(){e.setState({open:!1})};return r.a.createElement(r.a.Fragment,null,r.a.createElement(b.a,{position:"sticky"},r.a.createElement(E.a,null,r.a.createElement(Z.a,{edge:"start",className:t.menuButton,color:"inherit","aria-label":"back",onClick:function(){return e.props.history.go(-1)}},r.a.createElement($.a,null)),r.a.createElement(f.a,{variant:"h6",className:t.title},"Consumers"))),r.a.createElement(y.a,{maxWidth:"sm",disableGutters:!0},r.a.createElement(k.a,null),r.a.createElement(K.a,{className:t.list},this.state.consumers.map((function(t){return r.a.createElement(Q.a,{key:t.consumerId,role:void 0,button:!0,onClick:function(){return function(t){e.setState({consumerName:t.name,selectedConsumer:t,open:!0})}(t)}},r.a.createElement(oe.a,{primary:t.name}),r.a.createElement(Oe.a,{onClick:function(){return function(t){L.putConsumer(Object(z.a)(Object(z.a)({},t),{},{active:!t.active})).then(e.refresh)}(t)}},r.a.createElement(Z.a,{edge:"end","arial-label":"show or hide"},t.active?r.a.createElement(Ne.a,null):r.a.createElement(Be.a,null))))})))),r.a.createElement(je.a,{open:this.state.open,onClose:a,"aria-labelledby":"form-dialog-title"},r.a.createElement(we.a,{id:"form-dialog-title"},"Change consumer"),r.a.createElement(Ce.a,null,r.a.createElement(W.a,{autoFocus:!0,margin:"dense",id:"name",label:"Consumer name",fullWidth:!0,value:this.state.consumerName,onChange:function(t){return e.setState({consumerName:t.target.value})}})),r.a.createElement(xe.a,null,r.a.createElement(g.a,{onClick:a,color:"primary"},"Cancel"),r.a.createElement(g.a,{onClick:function(){var t=e.state.selectedConsumer;null!=t&&(L.putConsumer(Object(z.a)(Object(z.a)({},t),{},{name:e.state.consumerName})).then(e.refresh),a())},color:"primary"},"Rename"))))}}]),a}(r.a.Component),Pe=Object(D.a)((function(e){return Object(G.a)({card:{borderColor:e.palette.secondary.main},list:{backgroundColor:e.palette.background.paper},media:{minHeight:120,backgroundColor:e.palette.secondary.main},largeIcon:{fontSize:"8em"},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1}})}))(Ge),We=function(e){Object(I.a)(a,e);var t=Object(B.a)(a);function a(){return Object(x.a)(this,a),t.apply(this,arguments)}return Object(S.a)(a,[{key:"render",value:function(){var e=this,t=this.props.classes;return r.a.createElement("div",null,r.a.createElement(b.a,{position:"sticky"},r.a.createElement(E.a,null,r.a.createElement(Z.a,{edge:"start",className:t.menuButton,color:"inherit","aria-label":"back",onClick:function(){return e.props.history.go(-1)}},r.a.createElement($.a,null)),r.a.createElement(f.a,{variant:"h6",className:t.title},"Behavior"))),r.a.createElement(y.a,{maxWidth:"md"},r.a.createElement(f.a,{variant:"h4"},"Not implemented")))}}]),a}(r.a.Component),De=Object(D.a)((function(e){return Object(G.a)({menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1},input:{display:"none"}})}))(We),ze=Object(s.a)({palette:{primary:{main:"#7cb342",light:"#aee571",dark:"#4b830d",contrastText:"#fff"},secondary:{main:"#9ccc65",light:"#cfff95",dark:"#6b9b37"}}});c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(u.a,{theme:ze},r.a.createElement(i.a,null,r.a.createElement(l.d,null,r.a.createElement(l.b,{path:"/login",component:q}),r.a.createElement(l.b,{path:"/verify",component:de}),r.a.createElement(Y,{path:"/logout",component:H}),r.a.createElement(Y,{path:"/upload",component:ne}),r.a.createElement(Y,{path:"/user",component:le}),r.a.createElement(Y,{path:"/survey",component:pe}),r.a.createElement(Y,{path:"/power",component:Ee}),r.a.createElement(Y,{path:"/archive",component:ke}),r.a.createElement(Y,{path:"/consumers",component:Pe}),r.a.createElement(Y,{path:"/behavior",component:De}),r.a.createElement(Y,{path:"/",exact:!0,component:C}))))),document.getElementById("root"))}},[[201,1,2]]]);
//# sourceMappingURL=main.8f32efd1.chunk.js.map