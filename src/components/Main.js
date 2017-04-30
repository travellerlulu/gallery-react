/**
 * Created by bailu on 2017/4/30.
 */
require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imgDatas = require('../data/data.json');

class ImgFigure extends React.Component {
  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.props.arrange.isCenter) {
      this.props.inverse()
    } else {
      this.props.center()
    }
  }

  render() {
    let styleObj = {};
    //如果props中提供了图片位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    if (this.props.arrange.rotate) {
      (['Webkit', 'Moz', 'Ms', '']).forEach((value) => {
        styleObj[value + 'Transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      })
    }
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }
    let imgClassName = 'img-figure';
    imgClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    return (
      <figure className={imgClassName} style={styleObj} ref={r => this._img = r} onClick={this.handleClick.bind(this)}>
        <img src={this.props.data.imgUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back">
            <p>{this.props.data.des}</p>
          </div>
        </figcaption>
      </figure>
    )
  }
}

class ControllerUnit extends React.Component {
  handleClick() {
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
  }
  render() {
    let cls = 'controller-unit',
      arrange = this.props.arrange;
    cls += arrange.isCenter ? ' isCenter' : '';
    cls += arrange.isInverse ? ' is-inverse' : '';
    return (
      <span className={cls} onClick={this.handleClick.bind(this)}></span>
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
  Constant = {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  }
  state = {
    imgsArrangeArr: [
      /*{
       pos: {
       top: 0,
       left: 0
       },
       rotate: 0,
       isInverse: false, //false表示正面，true表示翻面
       isCenter: false //图片是否居中
       }*/
    ]
  }
  /*
   * 获取区间内的一个随机数
   * */
  getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
  }

  /*
   * 获取一个0～30的任意正负值
   * */
  get30DegRandom() {
    return (Math.random() > 0.5 ? '+' : '-') + Math.ceil(Math.random() * 30);
  }

  //重新布局所有图片
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      //存储放在上侧区域的状态信息
      imgsArrangeTopArr = [],
      topImgSpliceIndex = 0, //上侧图片在数组中的位置
      topImgNum = Math.ceil(Math.random() * 2); //取一个或0个放在上侧
    //取出布局在上侧的图片
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }
    })

    //存储放在中间图片的状态信息
    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    //首先居中centerIndex的图片
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };
    //取出布局在左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLOR;
      //假设将前半部分放在左侧，后半部分放在右侧
      hPosRangeLOR = i < k ? hPosRangeLeftSecX : hPosRangeRightSecX;
      imgsArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLOR[0], hPosRangeLOR[1])
        },
        rotate: this.get30DegRandom(),
        isCenter: false
      }
    }
    //将取出来的Top再放回去
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    //将取出来的Center再放回去
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })

  }

  //组件加载后计算图片位置范围
  componentDidMount() {
    //获取舞台宽高
    const stageDom = this.refs.stage;
    const stageW = stageDom.scrollWidth;
    const stageH = stageDom.scrollHeight;
    const halfStageW = Math.ceil(stageW / 2);
    const halfStageH = Math.ceil(stageH / 2);
    //获取图片宽高
    const imgFigureDom = this.child._img;
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
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.rearrange(0);
  }

  inverse(index) {
    const imgsArrangeArr = this.state.imgsArrangeArr;
    imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  }

  center(index) {
    this.rearrange(index);
  }

  render() {
    let controllerUnits = [],
      imgFigures = [];
    imgDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={value} key={index} ref={r => this.child = r}
                                 arrange={this.state.imgsArrangeArr[index]} inverse={() => {
        this.inverse(index)
      }} center={() => {
        this.center(index)
      }}/>);
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} center={() => {
        this.center(index)}} inverse={() => {this.inverse(index)}}/>);
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
