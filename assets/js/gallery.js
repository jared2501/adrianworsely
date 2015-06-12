// http://www.crispymtn.com/stories/the-algorithm-for-a-perfectly-balanced-photo-gallery source
// var viewport_width = $(window).width(),
// 	ideal_height = parseInt($(window).height() / 2),
// 	summed_width = photos.reduce ((sum, p) -> sum += p.get('aspect_ratio') * ideal_height), 0
// 	rows = Math.round(summed_width / viewport_width);
 
// if rows < 1
// 	# (2a) Fallback to just standard size 
// 	photos.each (photo) -> photo.view.resize parseInt(ideal_height * photo.get('aspect_ratio')), ideal_height
// else
// 	# (2b) Distribute photos over rows using the aspect ratio as weight
// 	weights = photos.map (p) -> parseInt(p.get('aspect_ratio') * 100)
// 	partition = linear_partition(weights, rows)

// 	# (3) Iterate through partition
// 	index = 0
// 	row_buffer = new Backbone.Collection
// 	_.each partition, (row) ->
// 		row_buffer.reset()
// 		_.each row, -> row_buffer.add(photos.at(index++))
// 		summed_ratios = row_buffer.reduce ((sum, p) -> sum += p.get('aspect_ratio')), 0
// 		row_buffer.each (photo) -> photo.view.resize parseInt(viewport_width / summed_ratios * photo.get('aspect_ratio')), parseInt(viewport_width / summed_ratios)

var linear_partition,
	_this = this;

linear_partition = function(seq, k) {
	var ans, i, j, m, n, solution, table, x, y, _i, _j, _k, _l;
	n = seq.length;
	if (k <= 0) {
		return [];
	}
	if (k > n) {
		return seq.map(function(x) {
			return [x];
		});
	}
	table = (function() {
		var _i, _results;
		_results = [];
		for (y = _i = 0; 0 <= n ? _i < n : _i > n; y = 0 <= n ? ++_i : --_i) {
			_results.push((function() {
				var _j, _results1;
				_results1 = [];
				for (x = _j = 0; 0 <= k ? _j < k : _j > k; x = 0 <= k ? ++_j : --_j) {
					_results1.push(0);
				}
				return _results1;
			})());
		}
		return _results;
	})();
	solution = (function() {
		var _i, _ref, _results;
		_results = [];
		for (y = _i = 0, _ref = n - 1; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
			_results.push((function() {
				var _j, _ref1, _results1;
				_results1 = [];
				for (x = _j = 0, _ref1 = k - 1; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
					_results1.push(0);
				}
				return _results1;
			})());
		}
		return _results;
	})();
	for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
		table[i][0] = seq[i] + (i ? table[i - 1][0] : 0);
	}
	for (j = _j = 0; 0 <= k ? _j < k : _j > k; j = 0 <= k ? ++_j : --_j) {
		table[0][j] = seq[0];
	}
	for (i = _k = 1; 1 <= n ? _k < n : _k > n; i = 1 <= n ? ++_k : --_k) {
		for (j = _l = 1; 1 <= k ? _l < k : _l > k; j = 1 <= k ? ++_l : --_l) {
			m = _.min((function() {
				var _m, _results;
				_results = [];
				for (x = _m = 0; 0 <= i ? _m < i : _m > i; x = 0 <= i ? ++_m : --_m) {
					_results.push([_.max([table[x][j - 1], table[i][0] - table[x][0]]), x]);
				}
				return _results;
			})(), function(o) {
				return o[0];
			});
			table[i][j] = m[0];
			solution[i - 1][j - 1] = m[1];
		}
	}
	n = n - 1;
	k = k - 2;
	ans = [];
	while (k >= 0) {
		ans = [
			(function() {
				var _m, _ref, _ref1, _results;
				_results = [];
				for (i = _m = _ref = solution[n - 1][k] + 1, _ref1 = n + 1; _ref <= _ref1 ? _m < _ref1 : _m > _ref1; i = _ref <= _ref1 ? ++_m : --_m) {
					_results.push(seq[i]);
				}
				return _results;
			})()
		].concat(ans);
		n = solution[n - 1][k];
		k = k - 1;
	}
	return [
		(function() {
			var _m, _ref, _results;
			_results = [];
			for (i = _m = 0, _ref = n + 1; 0 <= _ref ? _m < _ref : _m > _ref; i = 0 <= _ref ? ++_m : --_m) {
				_results.push(seq[i]);
			}
			return _results;
		})()
	].concat(ans);
};


// http://www.crispymtn.com/stories/the-algorithm-for-a-perfectly-balanced-photo-gallery
// The width of the gallery container is the viewport
// Sources says height/2 is ideal height
var distribute = function(imgs, viewport_width, ideal_height) {
	var summed_width = _.reduce(imgs, function(sum, img) { return sum += img.aspect_ratio*ideal_height; }, 0),
		rows = Math.round(summed_width / viewport_width);

	if(rows < 1) {
		// (2a) Fallback to just standard size 
		_.each(imgs, function(img) {
			var height = ideal_height;
			var width = ideal_height*img.aspect_ratio;
			img.calculated_dims = {width: width, height: height};
		});
	} else {
		// (2b) Distribute photos over rows using the aspect ratio as weight
		var weights = _.map(imgs, function(img) {
			return img.aspect_ratio*100;
		});
		var partition = linear_partition(weights, rows);

		// (3) Iterate through partition
		var index = 0;
		_.each(partition, function(row) {
			var row_buffer = [];

			// Get the photos for the row
			_.each(row, function() {
				row_buffer.push(imgs[index++]);
			});

			var summed_ratios = _.reduce(row_buffer, function(sum, img) {
				return sum += img.aspect_ratio; // Summ all the aspect ratios
			}, 0);

			_.each(row_buffer, function(img) {
				var width = viewport_width / summed_ratios * img.aspect_ratio;
				var height = viewport_width / summed_ratios;
				img.calculated_dims = {width: width, height: height};
			});
		});
	}

	var html_string = "";

	_.each(imgs, function(img) {
		var div = '<a data-lightbox="'+img.folder+'" href="'+img.folder+'big/'+img.name+'" title="'+img.caption+
		'" class="photo" style="background-image: url('+img.folder+'small/'+img.name+'); width: '+(img.calculated_dims.width-4)+'px; height: '+img.calculated_dims.height+'px;"></a>';
		html_string += div;
	});

	return html_string + '<div style="clear: both"></div>';
};