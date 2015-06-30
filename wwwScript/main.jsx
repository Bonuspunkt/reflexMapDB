var router = require('./router');
var React = require('react');

var HomeBody = require('./views/components/homeBody');

var Loader = require('./views/components/loader');
var ProfileBody = require('./views/components/profileBody');

var contentEl = document.getElementById('content');

router.registerRoute('/', function(e) {
    React.render(<HomeBody/>, contentEl);
});

router.registerRoute('/u/:id/:page?', function(e) {
    var url = '/uiApi/user/' + e.params.id + '/' + (e.params.page || '');
    React.render(
        <Loader component={ ProfileBody } src={ url } />,
        contentEl
    );
});

router.start();
