// 不再 fetch；直接读取 window.APP_DATA
document.addEventListener('DOMContentLoaded', () => {
  const chartDom = document.getElementById('chart');
  const myChart = echarts.init(chartDom);

  const data = (window.APP_DATA && typeof window.APP_DATA === 'object') ? window.APP_DATA : {};

  // 只把有数据的省份塞进 series
  const seriesData = Object.keys(data).map(province => ({
    name: province,
    value: 1,
    info: data[province]
  }));

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const info = params.data && params.data.info;
        if (info) {
          const get = (k) => (info[k] != null && info[k] !== '') ? info[k] : '—';
          return [
            params.name,
            `渠道商：${get("渠道商")}`,
            `产品类别：${get("产品类别")}`,
            `应用规模：${get("应用规模")}`
          ].join('<br/>');
        }
        return `${params.name}<br/>无数据`;
      }
    },
    visualMap: { show: false, min: 0, max: 1, inRange: { color: ['#e0f3ff', '#006edd'] } },
    series: [{
      name: '应用区域',
      type: 'map',
      map: 'china',
      roam: true,
      label: { show: true, fontSize: 10 },
      data: seriesData
    }]
  };

  myChart.setOption(option);

  // 自适应（手机旋转/窗口变化）
  window.addEventListener('resize', () => {
    myChart.resize();
  });
});
