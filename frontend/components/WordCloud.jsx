import React from 'react';
import cloud from 'd3-cloud';
import * as d3 from 'd3';

class WordCloud extends React.Component {
  constructor() {
    super()
    this.state = {loading: true, retstart: 0};
  }

  componentDidMount() {
      let getArticles = ({queryKey, WebEnv}) => {
        $.ajax('/pubmed/articles', { data: {
          queryKey, WebEnv, retstart: this.state.retstart
        }}).then(response => {
          this.setState({
            retstart: this.state.retstart + 50,
            loading: false
          },
            () => this.sumUpString(response)
          );
        });
      };

      $.ajax('/pubmed/hits', { data: {
        diseaseName: this.props.diseaseName
      }}).then(response => getArticles(response));
  }

  sumUpString(response) {
    let text_string = "";
    response.forEach(obj => {
      if (obj.abstract) text_string += (obj.abstract + " ");
      if (obj.title) text_string += (obj.title + " ");
    })

    this.drawWordCloud(text_string);
  }

  drawWordCloud(text_string) {
    //Code based on example: https://bl.ocks.org/blockspring/847a40e23f68d6d7e8b5
    let common = `i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall`;

    let word_count = {};

    let words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);
      if (words.length == 1){
        word_count[words[0]] = 1;
      } else {
        words.forEach(function(word){
          word = word.toLowerCase();
          if (word != "" && common.indexOf(word) == -1 && word.length > 1){
            if (word_count[word]){
              word_count[word]++;
            } else {
              word_count[word] = 1;
            }
          }
        })
      }

    let svg_location = "#wordCloudDiv";
    let w = $(`.wordCloudSlide`).width();
    let h = $(`.wordCloudSlide`).height() - $(`#wcTitleContainer`).height();

    let fill = d3.scaleOrdinal(d3.schemeCategory20);

    let word_entries = d3.entries(word_count);

    let xScale = d3.scaleLinear()
       .domain([0, d3.max(word_entries, function(d) {
          return d.value;
        })
       ])
       .range([10,100]);

    cloud().size([w - 100, h - 120])
      .timeInterval(20)
      .words(word_entries)
      .fontSize(function(d) { return xScale(+d.value); })
      .text(function(d) { return d.key; })
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .on("end", draw)
      .start();

    function draw(words) {
      d3.select(svg_location).append("svg")
          .attr("viewBox", `0 0 ${w} ${h}`)
        .append("g")
          .attr("transform", "translate(" + [w >> 1, h >> 1] + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return xScale(d.value) + "px"; })
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.key; });
    }

    cloud().stop();
  }

  render() {
    let diseaseName = this.props.diseaseName;
    let diseaseSpan = <span className="slideTitleColorText">
      {`"${diseaseName}"`}</span>;

    let numOfArticles = <span className="slideTitleColorText">
      {this.state.retstart}</span>;

    // let clickSpan = <span
    //     className="slideTitleColorText slideLink"
    //     onClick={this.clickHandler}>
    //     here</span>;
    //
    // Click {clickSpan} to add 50 more.

    let spinner = <div className='loadingDiv'><img src="./loading.svg" /></div>;

    return (
      <div className='wordCloudSlideInnerDiv'>
        <div className="slideTitleContainer" id='wcTitleContainer'>
          <div className="slideTitle">
            A word cloud of the titles and abstracts of the {numOfArticles} most recent
            PubMed articles related to {diseaseSpan}.
          </div>
          {this.state.loading && spinner}
        </div>

        <div id="wordCloudDiv">
          {this.state.loading && spinner}
        </div>;
      </div>
    );
  }
}

export default WordCloud;
