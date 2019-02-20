<template>
  <div>
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        <i class="fa fa-pie-chart"></i>&nbsp;&nbsp;Data Chart
      </h1>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box box-primary">
        <div class="box-body">
          <div class="row box-solid">
            <div class="col-md-6">
              <!-- Calendar -->
              <div class="box box-solid bg-light-blue">
                <div class="box-header">
                  <i class="fa fa-calendar"></i>

                  <h3 class="box-title">Calendar</h3>

                  <!-- /. tools -->
                </div>
                <!-- /.box-header -->
                <div class="box-body no-padding">
                  <!--The calendar -->
                  <div id="calendar" style="width: 100%"></div>
                </div>
                <div class="box-footer bg-light-blue" style="text-align:center">
                  <h3>
                    <i class="fa fa-binoculars"></i>&nbsp;&nbsp;
                    <label>{{date.begin.getFullYear()}} Week {{date.week}}&nbsp;&nbsp;&nbsp;</label>
                    <br>
                    <span>{{date.begin.toLocaleDateString()}} - {{date.end.toLocaleDateString()}}</span>
                  </h3>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="box-body" style="min-height:300px">
                <div class="chart-responsive">
                  <canvas id="pieChart"></canvas>
                </div>
                <!-- ./chart-responsive -->
              </div>
            </div>
          </div>

          <div class="row">
            <!-- STACK CHART -->
            <div class="box-body">
              <div class="chart">
                <canvas id="areaChart" style="height:250px"></canvas>
              </div>
              <!-- /.box-body -->
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- /.box -->
</template>

<script>
import { mapActions } from 'vuex';
import HTTP from '@/http';
import router from '@/router';

export default {
  data() {
    return {
      date: {
        begin: new Date(),
        end: new Date(),
        week: null
      },

      pieChart: null,
      lineChart: null
    };
  },
  mounted() {
    var self = this;

    this.initChart();
    // this.fetchChartData('2019-02-12~2019-02-17');
    //$('#calendar').datepicker('setDate', new Date());

    $('#calendar')
      .datepicker({
        calendarWeeks: true,
        todayHighlight: true,
        defaultDate: new Date(),
        endDate: new Date()
      })
      .on('changeDate', function(e) {
        var weekData = $('.datepicker-days')
          .find('td.active')
          .removeClass('active')
          .parent();

        // not work????
        console.log(weekData.attr('class') + ' ' + weekData.hasClass('active'));

        weekData = weekData.addClass('active').children();

        self.setDateRange(weekData);
      });

    //initialize today
    var weekData = $('.datepicker-days')
      .find('.today')
      .parent()
      .addClass('active')
      .children();
    self.setDateRange(weekData);
  },
  methods: {
    ...mapActions('errorStore', ['setGlobalError']),
    //get chart data from datatabse
    fetchChartData(range) {
      HTTP()
        .get(`change-request/chart/${range}`)
        .then(({ data }) => {
          this.updateChart(data);
        })
        .catch(e => {
          this.setGlobalError(e);
        });
    },

    setDateRange(weekData) {
      this.date.week = weekData[0].textContent;
      //first and last day milisecond
      this.date.begin = new Date(
        parseFloat(weekData[1].getAttribute('data-date'))
      );
      this.date.end = new Date(
        parseFloat(weekData[7].getAttribute('data-date'))
      );
      this.fetchChartData(
        this.date.begin.toISOString().split('T')[0] +
          '~' +
          this.date.end.toISOString().split('T')[0]
      );
    },

    updateChart({ chartData, total }) {
      this.pieChart.data.datasets[0].data = chartData.pie;
      this.pieChart.options.title.text = `Week Total: ${total}`;
      this.pieChart.update();
      for (var i in this.lineChart.data.datasets) {
        this.lineChart.data.datasets[i].data = chartData.line[i];
      }
      this.lineChart.update();
    },

    initChart() {
      //-------------
      //- PIE CHART -
      //-------------
      // Get context with jQuery - using jQuery's .get() method.
      var pieChartCanvas = $('#pieChart')
        .get(0)
        .getContext('2d');

      this.pieChart = new Chart(pieChartCanvas, {
        type: 'pie',
        data: {
          datasets: [
            {
              data: [],
              backgroundColor: ['#f56954', '#f39c12', '#00c0ef', '#00a65a']
            }
          ],
          labels: ['Cancelled', 'To DO', 'In Progress', 'Complete']
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 0.9,
          onResize: chart => {
            if ($(document).width() < 450) {
              chart.options.legend.position = 'bottom';
              chart.options.legend.labels = {
                fontSize: 14,
                padding: 10
              };
            } else {
              chart.options.legend.position = 'left';
              chart.options.legend.labels = {
                fontSize: 16,
                padding: 40
              };
            }
          },
          legend: {
            display: true,
            position: $(document).width() < 450 ? 'bottom' : 'left',

            labels: {
              fontSize: $(document).width() < 450 ? 14 : 16,
              padding: $(document).width() < 450 ? 10 : 40
            }
          },
          title: {
            display: true,
            text: `Week Total: 0`,
            fontSize: 20
          }
        }
      });

      var areaChartCanvas = $('#areaChart')
        .get(0)
        .getContext('2d');
      this.lineChart = new Chart(areaChartCanvas, {
        type: 'line',
        data: {
          labels: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wendnesday',
            'Thursday',
            'Friday',
            'Saturday'
          ],
          datasets: [
            {
              label: 'Cancelled',
              borderColor: '#f56954',
              backgroundColor: '#f56954',
              data: []
            },
            {
              label: 'To Do',
              borderColor: '#f39c12',
              backgroundColor: '#f39c12',
              data: []
            },
            {
              label: 'In Progress',
              borderColor: '#00c0ef',
              backgroundColor: '#00c0ef',
              data: []
            },
            {
              label: 'Complete',
              borderColor: '#00a65a',
              backgroundColor: '#00a65a',
              data: []
            }
          ]
        },
        options: {
          responsive: true,
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Stack Chart'
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            yAxes: [
              {
                stacked: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Sum'
                }
              }
            ]
          }
        }
      });
    }
  }
};
</script>

<style>
.chart {
  display: block;
  width: 100%;
}

.datepicker table tr td.today {
  background: rgba(197, 159, 159, 0.3) !important;
  color: white !important;
}
.datepicker table tbody .active {
  background-color: lightblue !important;
  color: black !important;
}
.datepicker table tbody .active .day {
  color: black !important;
}
.datepicker table tbody .day {
  border-radius: 0;
}

#calendar .table-condensed tbody tr:hover {
  background-color: lavender;
  color: black !important;
}
</style>
