/** 
 * Created by Jarrod Carson on 1/30/2021
 */

module.exports = function(){
  const context = this._context;
  const state = this.state;
  const props = this.props;
  const that = this;
  let py;

  return {
    update(){},
    draw(){
      context.fillRect(props.paddleWidth, 0, props.borderWidth, props.borderHeight);
      context.fillRect(props.paddleWidth, props.height - props.borderHeight, props.borderWidth, props.borderHeight);
    },
    name(){
      return 'border';
    },
    position(){}
  };
};