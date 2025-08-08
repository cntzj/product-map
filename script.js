document.addEventListener('DOMContentLoaded', () => {
  const chartDom = document.getElementById('chart');
  const myChart = echarts.init(chartDom);

  // 省会经纬度表（可按需要扩充/调整）
  const geoCoordMap = {
    '广东': [113.280637, 23.125178],
    '云南': [102.712251, 25.040609],
    '浙江': [120.153576, 30.287459],
    '新疆': [87.617733, 43.792818],
    '北京': [116.405285, 39.904989],
    '上海': [121.472644, 31.231706]
    // ... 可继续添加
  };

  fetch('data.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load data.json');
      return response.json();
    })
    .then(data => {
      const seriesData = Object.keys(data).map(province => ({
        name: province,
        value: 1,
        info: data[province]
      }));

      // 转换为波纹点数据
      const scatterData = Object.keys(data).map(province => {
        const coord = geoCoordMap[province];
        if (coord) {
          return {
            name: province,
            value: coord.concat(1), // 经纬度 + value
            info: data[province]
          };
        }
        return null;
      }).filter(item => item !== null);

      const option = {
        backgroundColor: 'transparent',
        title: {
          text: '传感器应用区域分布',
          left: 'center',
          top: 20,
          textStyle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(50,50,50,0.85)',
          borderColor: '#ccc',
          borderWidth: 1,
          textStyle: { color: '#fff', fontSize: 14 },
          formatter: function (params) {
            if (params.data && params.data.info) {
              const info = params.data.info;
              return `
                <strong>${params.name}</strong><br/>
                <span>渠道商：</span>${info.渠道商}<br/>
                <span>产品类别：</span>${info.产品类别}<br/>
                <span>应用规模：</span>${info.应用规模}
              `;
            }
            return `${params.name}<br/>无数据`;
          }
        },
        geo: {
          map: 'china',
          roam: true,
          zoom: 1.2,
          label: {
            show: true,
            fontSize: 9,
            color: '#444'
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
            areaColor: '#e0f3ff',
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 5
          },
          emphasis: {
            label: { color: '#000', fontWeight: 'bold' },
            itemStyle: {
              areaColor: '#ffa940',
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 8
            }
          }
        },
        series: [
          // 地图底层
          {
            name: '应用区域',
            type: 'map',
            map: 'china',
            geoIndex: 0,
            data: seriesData
          },
          // 波纹效果层
          {
            name: '热点',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: scatterData,
            symbolSize: 12,
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
              scale: 4
            },
            hoverAnimation: true,
            itemStyle: {
              color: '#ff5722',
              shadowBlur: 10,
              shadowColor: '#333'
            },
            zlevel: 2
          }
        ]
      };

      myChart.setOption(option);
      window.addEventListener('resize', () => myChart.resize());
    })
    .catch(error => {
      console.error('Error loading or parsing data.json:', error);
      chartDom.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">无法加载数据。</p>';
    });
});
