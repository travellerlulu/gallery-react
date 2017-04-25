require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imgDatas = require('../data/data.json');

class ImgFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure">
        <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}

class GalleryByReact extends React.Component {
  /*left分区取值：stage.width/2 - imgFigure.width/2*3 > x > 0 - imgFigure.width/2
   *   stage.height - imgFigure.height/2 > y > 0 - imgFigure.height/2
   * right分区取值： stage.width-imgFigure/2 > x > stage.width/2 + imgFigure.width/2
   *   stage.height - imgFigure.height/2 > y > 0 - imgFigure.height/2
   * 上分区取值：stage.width/2 > x > stage.width/2 -imgFigure.width
   * stage.height/2 - imgFigure.height/2*3 > y > 0 - imgFigure.height / 2
   * */
  //图片排布可取值范围
  /*Constant: {
    centerPos:{
      left: 0,
      right: 0
    },
    hPosRange: {
      leftSecX: [0,0],
      rightSecX: [0,0],
      y: [0,0]
    },
    vPosRange: {
      x: [0,0],
      topY: [0,0]
    }
  },*/
  //组件加载后计算图片位置范围
    componentDidMount() {
      //获取舞台宽高
      const stageDom = this.refs.stage;
      const stageW = stageDom.scrollWidth;
      const stageH = stageDom.scrollHeight;
      const halfStageW = Math.ceil(stageW / 2);
      const halfStageH = Math.ceil(stageH / 2);
      //获取图片宽高
      const imgFigureDom = this.refs.imgFigure0;
      const imgW = imgFigureDom.scrollWidth;
      const imgH = imgFigureDom.scrollHeight;
      const halfImgW = Math.ceil(imgW / 2);
      const halfImgH = Math.ceil(imgH / 2);

      //计算取值范围
      this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      }
      this.Constant.hPosRange.leftSecX[0] = -halfImgW;
      this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
      this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
      this.Constant.hPosRange.y[0] = -halfImgH;
      this.Constant.hPosRange.y[1] = stageH - halfImgH;


    }
    render() {
      let controllerUnits = [],
        imgFigures = [];
      imgDatas.forEach((value, index) => {
        imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index}/>);
      });
      return (
        <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
        </section>
      );
    }
  }

  GalleryByReact.defaultProps = {};

  export default GalleryByReact;
