define(function(){

	// This is our standard Model object (all new Model instances will inherit the following methods)
	
	var Model = {
		
		// @description: this method grabs the data for this model
		getModelData: function(path) {
			var dfd = $.Deferred(),
				data = $.ajax({
					type: 'GET',
					url: path,
					dataType: 'json',
					error: dfd.reject,
					success: dfd.resolve
				});
				
			return dfd.promise();
		},
		
		// @description: this method generates a unique ID for each record in this Model
		generate_id: function() {
			// By wrapping the Math.guid() method we are free to change the implementation
			// without having to change the API
			return Math.guid();
		},
		
		// @description: this method populates the Model with its retrieved data (see: getModelData)
		populate: function(data) {
			var dfd = $.Deferred(),
				self = this, // the setTimeout causes the scope of 'this' (within the callback) to be lost
				todo = data.concat(); // create a clone of the original
			
			function process(arr) {
				var tempID = self.generate_id(), // generate a unique ID
					contact = {}; // create a new 'record'
				
				// Loop through the current record data and add it to our Model
				for (item in arr) {
					// We're coding defensively as we may find our script in an environment
					// where the native Array object has been augmented by another script/developer.
					if (arr.hasOwnProperty(item)) {
						contact.id = tempID;
						contact[item] = arr[item];
					}
				}
				
				// Now we have collated the data for this particular record we add it to our Model
				self.store.push(contact);
			}
			
			/*
			 * Because there is potential for the data-set to be very large
			 * we need to use a timer to split the long array into chunks.
			 */
			window.setTimeout(function timer(){
				var start = +new Date();
			
				// Process the current Array 
				// But only if the time that has passed so far hasn't exceeded 50ms
		        do {
		        	process(todo.shift());
		        } while (todo.length > 0 && (+new Date() - start < 50));
		
		        // If we've either passed 50ms (or the Processing of the Array hasn't completed)
		        // then execute this 'timer' function in 25ms time (this helps keep the UI from locking up), 
		        // otherwise tell the Deferred object that the Promise has been resolved
		        if (todo.length > 0){
		            setTimeout(timer, 25);
		        } else {
		        	// We pass through the populated data to the resolver
		            dfd.resolve(self.store);
		        }				
			}, 25);
			
			// As this function is going to be executing asynchronously (due to the timed Array processing)
		 	// we'll be using Deferreds/Promises to help keep the UI from locking up
			return dfd.promise();
		},
		
		// @description: this property is for storing data records in the Model
		store: []
		
	};
	
	return Model;
	
});