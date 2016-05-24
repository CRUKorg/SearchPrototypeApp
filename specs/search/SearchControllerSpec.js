describe('Controller: SearchController', function() {
  beforeEach(module('searchPrototypeApp'));

  var ctrl;

  beforeEach(inject(function($controller) {
    ctrl = $controller('SearchController');
  }));

  it('should have the message quack', function() {
    expect(ctrl.message).toEqual('quack');
  });
});