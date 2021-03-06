(function() {
  var async, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  async = require('async');

  module.exports = function(env, callback) {
    var Page, templateView;
    templateView = function(env, locals, contents, templates, callback) {

      /* Content view that expects content to have a @template instance var that
          matches a template in *templates*. Calls *callback* with output of template
          or null if @template is set to 'none'.
       */
      var ctx, template;
      if (this.template === 'none') {
        return callback(null, null);
      }
      template = templates[this.template];
      if (template == null) {
        callback(new Error("page '" + this.filename + "' specifies unknown template '" + this.template + "'"));
        return;
      }
      ctx = {
        env: env,
        page: this,
        contents: contents
      };
      env.utils.extend(ctx, locals);
      return template.render(ctx, callback);
    };
    Page = (function(_super) {
      __extends(Page, _super);


      /* Page base class, a page is content that has metadata, html and a template that renders it */

      function Page(filepath, metadata) {
        this.filepath = filepath;
        this.metadata = metadata;
      }

      Page.prototype.getFilename = function() {
        var dirname;
        if (this.metadata.filename != null) {
          dirname = path.dirname(this.filepath.relative);
          return path.join(dirname, this.metadata.filename);
        } else {
          return env.utils.stripExtension(this.filepath.relative) + '.html';
        }
      };

      Page.prototype.getUrl = function(base) {
        return Page.__super__.getUrl.call(this, base).replace(/index\.html$/, '');
      };

      Page.prototype.getView = function() {
        return this.metadata.view || 'template';
      };


      /* Page specific properties */

      Page.property('html', 'getHtml');

      Page.prototype.getHtml = function(base) {
        if (base == null) {
          base = env.config.baseUrl;
        }

        /* return html with all urls resolved using *base* */
        throw new Error('Not implemented.');
      };

      Page.property('intro', 'getIntro');

      Page.prototype.getIntro = function(base) {
        var cutoff, cutoffs, html, i, idx, _i, _len;
        html = this.getHtml(base);
        cutoffs = ['<span class="more', '<h2', '<hr'];
        idx = Infinity;
        for (_i = 0, _len = cutoffs.length; _i < _len; _i++) {
          cutoff = cutoffs[_i];
          i = html.indexOf(cutoff);
          if (i !== -1 && i < idx) {
            idx = i;
          }
        }
        if (idx !== Infinity) {
          return html.substr(0, idx);
        } else {
          return html;
        }
      };


      /* Template property used by the 'template' view */

      Page.property('template', function() {
        return this.metadata.template || env.config.defaultTemplate || 'none';
      });

      Page.property('title', function() {
        return this.metadata.title || 'Untitled';
      });

      Page.property('description', function() {
        return this.metadata.description || '';
      });

      Page.property('date', function() {
        return new Date(this.metadata.date || 0);
      });

      Page.property('rfc822date', function() {
        return env.utils.rfc822(this.date);
      });

      Page.property('hasMore', function() {
        if (this._html == null) {
          this._html = this.getHtml();
        }
        if (this._intro == null) {
          this._intro = this.getIntro();
        }
        if (this._hasMore == null) {
          this._hasMore = this._html.length > this._intro.length;
        }
        return this._hasMore;
      });

      Page.prototype.serialize = function() {

        /* return an instance of an Object with data for this page */
        throw new Error('Not implemented.');
      };

      return Page;

    })(env.ContentPlugin);
    env.plugins.Page = Page;
    env.registerView('template', templateView);
    return callback();
  };

}).call(this);
