angular.module("oto").factory("Stacks",["$http",function(a){var b=null,c=null;return{getAll:function(c){allStacks=[],a.get("/api/notes/stacks").success(function(a){jQuery.each(a,function(a,c){"Archive"!==c.title&&"Floating"!==c.title&&allStacks.push(c),"Floating"===c.title&&(b=c)}),c(allStacks,b)}).error(function(a){console.log(a),c([],null)})},add:function(b,c,d){var e={title:b};a.post("/api/notes/stacks",e).success(c).error(d)},rename:function(b,c,d,e){a.put("/api/notes/stacks/"+b,{title:c}).success(d).error(e)},remove:function(b,c,d){a["delete"]("/api/notes/stacks/"+b).success(c).error(d)},activeStack:c}}]);