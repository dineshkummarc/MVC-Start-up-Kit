// We need to define jQuery as a 'named module' so we can specify it as a dependancy
require.config({ 
	paths : { 
		'jquery' : 'Utils/jquery'
	} 
});

require(['Controllers/contacts', 'Models/contacts', 'Utils/polyfills'], function(Controller, Model){
	
	// After all our dependancies are loaded then we initialise the relevant Controller(s) for this page.
	Controller.init(Model);
	
	/*
		All our Controllers MUST be instantiated (and thus passed through the Model it controls).
		The Controller's init() method takes the passed through Model and calls that Model's internal getModelData() method.
		This getModelData() method uses a 'path' property (set separately on each Model instance) which tells the Model where its data source is.
	*/
	
});