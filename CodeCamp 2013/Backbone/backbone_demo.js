define(function() {
    var Model, Collection
	Model = Backbone.Model.extend({
	    default: function() {
		    return {
			    name: 'khannie',
				age: 0,
				height: 0,
				nickname: '',
				hobby: ''
			}
		};
		
		validate: function(attr, options) {
		
	    }
	});
	Collection = Backbone.Collection.extend({
	    model: Model,
		localStorage: new Backbone.localStorage		
	});
	return {
	    Model: Model,
		Collection: Collection
	}
});