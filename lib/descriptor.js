/*
    express-api-descriptor
    Copyright(c) 2020 Alberto Ziliotto
    MIT Licensed
*/

'use strict';

let getendpoints = require('./getendpoints');


function Descriptor (express) {
    ////////////////////////////// ZLA ///////////////////////////////////
    express.Router.prototype.constructor.descriptor = function (o) {
        //this.stack[this.stack.length-1].route.o = o;
        setDescriptor(this.stack[this.stack.length-1].route, o);
        return this;
    }

    express.Router.prototype.descriptor = function (o) {
        setDescriptor(this, o);
        return this;
    }
  

    ///////////////////////////////////////////////////////////////////////
    // Extends Express functionalities
    express.prototype.constructor.application.descriptor = function (o) {
        //this._router.stack[this._router.stack.length-1].route.o = o;
        setDescriptor(this._router.stack[this._router.stack.length-1].route, o);
        return this;
    }

    express.Route.prototype.descriptor = function (o) {
        setDescriptor(this, o);
        return this;
    }

    return {  
        /////////////////////////////////////////////////////////////////// 
        //return all routes with 'descriptor' key inside     
        listEndpoints: function(app){
            var _endpoints = getendpoints(app);;
            //filter endpoints doesen't have the 'descriptor key'
            for(var f=0;f<_endpoints.length;f++){
            //_endpoints.forEach((_element, f)=>{
                var _element = _endpoints[f];
                //console.log("element",_element)
                if(_element.descriptor)
                for(var i=0;i<_element.descriptor.length;i++){
                    var descriptor = _element.descriptor[i];
                //_element.descriptor.forEach((descriptor, i)=>{
                    //console.log("element",descriptor)
                    if(descriptor == undefined){
                        var toDelParent = 0;
                        //remove this item from descriptor key and also from methods key
                        _element.descriptor.splice( i, 1 );                        
                        if(_element.descriptor.length==0){
                            delete _element.descriptor;
                            toDelParent++;
                        }

                        _element.methods.splice( i, 1 );
                        if(_element.methods.length==0){
                            delete _element.methods;
                            toDelParent++
                        }
                        //decrease counter for descriptor
                        //if(i!=0)
                            i--;
                        if(toDelParent==2){
                            _endpoints.splice( f, 1 );   
                            //decrease counter for endpoint 
                            //if(f!=0)
                                f--;       
                                break;                 
                        }
                    }                    
                }
            }
            return _endpoints;
        },
        ////////////////////////////////////////////////////////////////
        //return all routes defined inside the express object
        listAllEndpoints: function(app){
            return getendpoints(app);
        }
        

    }
}

function setDescriptor (route, o) {
    route.o = o;
}


module.exports = Descriptor;