<template>
  <v-container>
    <v-sheet>
      <v-toolbar dense dark color="primary">
        <v-toolbar-title> Cleaning Hours </v-toolbar-title>
      </v-toolbar>

      <v-date-picker
        v-model="dates"
        multiple
        elevation="5"
        no-title
        @input="updateDates"
        :picker-date.sync="monthChange"
      >
      </v-date-picker>

      <div v-for="(value, name) in days" v-bind:key="name">
        <p v-if="value != 0">
          {{ name.charAt(0).toUpperCase() + name.slice(1) }}: {{ value }} *
          {{ rate }} = {{ value * rate }}
        </p>
      </div>

      <p>
        Total:
        {{
          days.sunday * rate +
          days.monday * rate +
          days.tuesday * rate +
          days.wednesday * rate +
          days.thursday * rate +
          days.friday * rate +
          days.saturday * rate
        }}
      </p>
    </v-sheet>
    <v-sheet>
      <v-toolbar dense dark color="primary">
        <v-toolbar-title> Cleaning Hours PT </v-toolbar-title>
      </v-toolbar>

      <v-date-picker
        v-model="ptDates"
        multiple
        elevation="5"
        no-title
        @input="updatePTDates"
        :picker-date.sync="ptMonthChange"
      >
      </v-date-picker>

      <div v-for="(value, name) in ptDays" v-bind:key="name">
        <p v-if="value != 0">
          {{ name.charAt(0).toUpperCase() + name.slice(1) }}: {{ value }} *
          {{ ptRate }} = {{ value * ptRate }}
        </p>
      </div>

      <p>
        Total:
        {{
          ptDays.sunday * ptRate +
          ptDays.monday * ptRate +
          ptDays.tuesday * ptRate +
          ptDays.wednesday * ptRate +
          ptDays.thursday * ptRate +
          ptDays.friday * ptRate +
          ptDays.saturday * ptRate
        }}
      </p>
    </v-sheet>
  </v-container>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  data: () => ({
    baseUrl: "https://shielded-fortress-16685.herokuapp.com/timesheet",

    monthChange: null,
    month: "",
    dates: [""],
    days: {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
    },
    rate: 100,
    monthObject: null,

    ptMonthChange: null,
    ptMonth: "",
    ptDates: [""],
    ptDays: {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
    },
    ptRate: 50,
    ptMonthObject: null,
  }),
  watch: {
    /**
     * Cleaning Hours month change
     */
    monthChange(yearMonth) {
      this.month = yearMonth;
      this.getTimesheet("reg", yearMonth);
    },
    /**
     * Cleaning Hours PT month change
     */
    ptMonthChange(yearMonth) {
      this.ptMonth = yearMonth;
      this.getTimesheet("pt", yearMonth);
    },
  },
  methods: {
    getTimesheet(type, month) {
      axios.get(`${this.baseUrl}/${type}/${month}`).then((res) => {
        // if we have a response, update
        if (res.data.length != 0) {
          if (type === "reg") {
            this.monthObject = res.data[0];
            this.month = this.monthObject.yearMonth;
            this.dates = this.monthObject.dates;
            this.days = this.monthObject.days;
          } else {
            this.ptMonthObject = res.data[0];
            this.ptMonth = this.ptMonthObject.yearMonth;
            this.ptDates = this.ptMonthObject.dates;
            this.ptDays = this.ptMonthObject.days;
          }
        } else {
          // if not, its a new month, reset data
          if (type === "reg") {
            this.dates = [""];
            this.prepDays("reg");
            this.monthObject = null;
          } else {
            this.ptDates = [""];
            this.prepDays("pt");
            this.ptMonthObject = null;
          }
        }
      });
    },
    createTimesheet(type, month) {
      let dates;
      let days;
      if (type === "reg") {
        dates = this.dates;
        days = this.days;
      } else {
        dates = this.ptDates;
        days = this.ptDays;
      }

      axios
        .post(this.baseUrl, {
          name: type,
          yearMonth: month,
          dates: dates,
          days: days,
        })
        .then((res) => {
          if (type === "reg") {
            this.monthObject = res.data;
            this.month = this.monthObject.yearMonth;
            this.dates = this.monthObject.dates;
            this.days = this.monthObject.days;
          } else {
            this.ptMonthObject = res.data;
            this.ptMonth = this.ptMonthObject.yearMonth;
            this.ptDates = this.ptMonthObject.dates;
            this.ptDays = this.ptMonthObject.days;
          }
        });
    },
    updateTimesheet(type, month) {
      let dates;
      let days;
      if (type === "reg") {
        dates = this.dates;
        days = this.days;
      } else {
        dates = this.ptDates;
        days = this.ptDays;
      }

      axios
        .patch(`${this.baseUrl}/${type}/${month}`, {
          name: type,
          yearMonth: month,
          dates: dates,
          days: days,
        })
        .then((res) => {
          if (type === "reg") {
            this.monthObject = res.data;
            this.month = this.monthObject.yearMonth;
            this.dates = this.monthObject.dates;
            this.days = this.monthObject.days;
          } else {
            this.ptMonthObject = res.data;
            this.ptMonth = this.ptMonthObject.yearMonth;
            this.ptDates = this.ptMonthObject.dates;
            this.ptDays = this.ptMonthObject.days;
          }
        });
    },
    /**
     * Regular days methods
     */
    updateDates(dates) {
      this.prepDays("reg");
      this.countDays(dates);

      // if we have data, then call patch
      if (this.monthObject) {
        this.updateTimesheet("reg", this.month);
      } else {
        // if not then post
        this.createTimesheet("reg", this.month);
      }
    },
    prepDays(type) {
      if (type === "reg") {
        this.days = {
          sunday: 0,
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
        };
      } else {
        this.ptDays = {
          sunday: 0,
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
        };
      }
    },
    countDays(dates) {
      dates.forEach((date) => {
        if (date != "") {
          let day = moment(date).format("dddd");
          this.addToDays(day);
        }
      });
    },
    addToDays(day) {
      switch (day) {
        case "Sunday":
          this.days.sunday += 1;
          break;
        case "Monday":
          this.days.monday += 1;
          break;
        case "Tuesday":
          this.days.tuesday += 1;
          break;
        case "Wednesday":
          this.days.wednesday += 1;
          break;
        case "Thursday":
          this.days.thursday += 1;
          break;
        case "Friday":
          this.days.friday += 1;
          break;
        case "Saturday":
          this.days.saturday += 1;
          break;
        default:
          break;
      }
    },
    /**
     * PT days methods
     */
    updatePTDates(dates) {
      this.prepDays("pt");
      this.countPTDays(dates);

      // if we have data, then call patch
      if (this.ptMonthObject) {
        this.updateTimesheet("pt", this.ptMonth);
      } else {
        // if not then post
        this.createTimesheet("pt", this.ptMonth);
      }
    },
    countPTDays(dates) {
      dates.forEach((date) => {
        if (date != "") {
          let day = moment(date).format("dddd");
          this.addToPTDays(day);
        }
      });
    },
    addToPTDays(day) {
      switch (day) {
        case "Sunday":
          this.ptDays.sunday += 1;
          break;
        case "Monday":
          this.ptDays.monday += 1;
          break;
        case "Tuesday":
          this.ptDays.tuesday += 1;
          break;
        case "Wednesday":
          this.ptDays.wednesday += 1;
          break;
        case "Thursday":
          this.ptDays.thursday += 1;
          break;
        case "Friday":
          this.ptDays.friday += 1;
          break;
        case "Saturday":
          this.ptDays.saturday += 1;
          break;
        default:
          break;
      }
    },
  },
};
</script>