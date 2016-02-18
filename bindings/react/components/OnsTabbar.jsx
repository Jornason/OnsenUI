var OnsTabbar = React.createClass({
  componentDidMount: function() {


    var lastLink = window.OnsTabbarElement.rewritables.link;
    window.OnsTabbarElement.rewritables.link = function(el, target, options, callback) {
      lastLink(el, target, options, callback);
    }.bind(this);



    var node = this.node = ReactDOM.findDOMNode(this);

var children= [];
    this.childIndex = [];

    var tabContent = [];

    var activeIndex = -1;
    var index = -1;
    React.Children.forEach(this.props.children, function(child) {
      index++;
      // TODO CHECK FOR onsTab
      counter = -1;
      var myChildren = React.Children.map(child.props.children, function(child2) {
        counter++;
        return React.cloneElement(child2, {'data-ons-react':  counter});
      });

      this.childIndex.push(child.props.page);

      if (child.props.page) {
        var el = child.props.page;
        tabContent.push(el);

        if (child.props.active) {
          activeIndex = index;
        }
        
      } else {
        throw Error("OnsTab must contain a page property");
      }

      var mychild=  React.cloneElement(child, {}, myChildren);
      var renderString = ReactDOMServer.renderToStaticMarkup(mychild);

      var el = document.createElement('div');
      el.innerHTML = renderString;

      var newElement = buildComponent(el.firstChild, React.Children.toArray(child.props.children));

      children.push(newElement);
    }.bind(this));


      ReactDOM.render(
      <ons-tabbar var="tabbar" animation="fade" _compiled="true" class="ng-scope">
        <div className="ons-tab-bar__content tab-bar__content"> 
          {tabContent}
        </div> 
        <div className="tab-bar ons-tab-bar__footer ons-tabbar-inner">
          {children} 
        </div>
      </ons-tabbar>, node
      );

      for (var i=0; i < node.firstChild.children[1].children.length; i++) {
        node.firstChild.children[1].children[i]._pageElement = 
                node.firstChild.firstChild.children[i];
      }

      for (var i =0; i < node.firstChild.firstChild.children.length; i++) {
        node.firstChild.firstChild.children[i].style.display = 'none';
      }

      node.firstChild.setActiveTab(activeIndex);


      // some small things


  },
  render: function() {

    return <div> </div>
    
  }, 
});

var buildComponent = function(domElement, reactChildren) {
  if (domElement.hasAttribute('data-ons-react')) {
    var index = parseInt(domElement.getAttribute('data-ons-react'));
    return reactChildren[index];
  } else {
    var children = [];
    for (var i=0; i < domElement.children.length; i++) {
      children.push(buildComponent(domElement.children[i], reactChildren));
    }

    if (children.length > 0 ) {
      return <MyElem domNode={domElement} myClass={domElement.className} styleString={domElement.style.cssText}>
        {children}
      </MyElem>;
    } else {
      return <MyElem domNode={domElement} myClass={domElement.className} styleString={domElement.style.cssText} /> ;
    }

  }
};

var OnsTab = React.createClass({
    render: function() {
    return (<ons-tab {...this.props} > {this.props.children} </ons-tab>);
  }, 
});

var MyElem = React.createClass({
  componentDidMount: function() {

    var elem = this.props.domNode;
    console.log(elem.nodeName);
    console.log(elem.attributes);
    for (var i = 0; i < elem.attributes.length; i++) {
      var attrib = elem.attributes[i];
        ReactDOM.findDOMNode(this).setAttribute(attrib.name, attrib.value);
    }

    if (!this.props.children) {
      ReactDOM.findDOMNode(this).innerHTML = elem.innerHTML;
    }
  },
  render: function() {
    return React.createElement(this.props.domNode.nodeName, {'_compiled': ''}, this.props.children);
  },
});

var OnsTemplate = React.createClass({
  componentDidMount: function() {
    reactUtil.templateMap[this.props.id] = this;
  },
  render: function() {
    return (
      <ons-template type="text/ons-template" id={this.props.id}>
        {this.props.children}
      </ons-template>
   );
  }, 
});
