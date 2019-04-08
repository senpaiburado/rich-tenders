exports.install = function() {
	ROUTE('/*', view_cms);

	// Posts
	ROUTE("/", view_main_page, ['*Product']);
	ROUTE('#posts', view_posts, ['*Post']);
	ROUTE('#post', view_posts_detail, ['*Post']);
	ROUTE('#notices', view_notices, ['*Notice']);
};

function view_cms() {
	var self = this;
	self.CMSpage();
}
function view_main_page() {
	var self = this;

	NOSQL("products").find().make(function(builder) {
		builder.callback(function(err, result) {
			if (err) {
				return;
			}

			var json_groupby = require('json-groupby');
			var grouped_data = json_groupby(result, ['category']);

			var lenght = function(item) {
				var count = 0;
				for (var key in item) {
					if (item.hasOwnProperty(key))
						count++;
				}
				return count;
			}

			var arr = [];
			for (var name in grouped_data) {
				if (arr.length >= 3)
					break;
				var item = grouped_data[name];
				if (lenght(item) >= 3) {
					arr.push([item[0], item[1], item[2]]);
				}
			}


			self.sitemap();
			self.view("index", arr);
		})
	});
}

function view_posts() {
	var self = this;
	var options = {};

	options.page = self.query.page;
	options.published = true;
	options.limit = 10;
	// options.category = 'category_linker';

	self.sitemap();
	self.$query(options, self.callback('posts'));
}

function view_posts_detail(linker) {

	var self = this;
	var options = {};

	options.linker = linker;
	// options.category = 'category_linker';

	self.$workflow('render', options, function(err, response) {

		if (err) {
			self.throw404();
			return;
		}

		self.sitemap();
		self.sitemap_replace(self.sitemapid, response.name);
		self.view('cms/' + response.template, response);
	});
}

function view_notices() {
	var self = this;
	var options = {};

	options.published = true;

	self.sitemap();
	self.$query(options, self.callback('notices'));
}