document.addEventListener('DOMContentLoaded', () => {
  const chartDom = document.getElementById('chart');
  const myChart = echarts.init(chartDom);

  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load data.json');
      }
      return response.json();
    })
    .then(data => {
      const seriesData = Object.keys(data).map(province => ({
        name: province,
        value: 1,
        info: data[province]
      }));

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (params.data && params.data.info) {
              const info = params.data.info;
              return `${params.name}<br/>渠道商：${info.渠道商}<br/>时间：${info.时间}<br/>产品：${info.产品}`;
            }
            return `${params.name}<br/>无数据`;
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 1,
          inRange: {
            color: ['#e0f3ff', '#006edd']
          }
        },
        series: [
          {
            name: '应用区域',
            type: 'map',
            map: 'china',
            roam: true,
            label: {
              show: true,
              fontSize: 9
            },
            data: seriesData
          }
        ]
      };

      myChart.setOption(option);
    })
    .catch(error => {
      console.error('Error loading or parsing data.json:', error);
      chartDom.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">无法加载数据。</p>';
    });
});
