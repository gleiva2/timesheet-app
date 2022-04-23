<template>
  <v-container>
    <v-sheet>
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
  </v-container>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "CleaningHours",
  props: { type: { type: String, default: "reg" } },
  data: () => ({
    baseUrl: "https://shielded-fortress-16685.herokuapp.com/timesheet",
    //baseUrl: "http://localhost:3000/timesheet",

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
    rate: this.type === "reg" ? 100 : 50,
    monthObject: null,
  }),
  watch: {
    /**
     * Cleaning Hours month change
     */
    monthChange(yearMonth) {
      this.month = yearMonth;
      this.getTimesheet(this.type, yearMonth);
    },
  },
  methods: {
    getTimesheet(type, month) {
      axios.get(`${this.baseUrl}/${type}/${month}`).then((res) => {
        // if we have a response, update
        if (res.data.length != 0) {
          this.monthObject = res.data[0];
          this.month = this.monthObject.yearMonth;
          this.dates = this.monthObject.dates;
          this.days = this.monthObject.days;
        } else {
          // if not, its a new month, reset data
          this.dates = [""];
          this.prepDays(this.type);
          this.monthObject = null;
        }
      });
    },
    createTimesheet(type, month) {
      axios
        .post(this.baseUrl, {
          name: type,
          yearMonth: month,
          dates: this.dates,
          days: this.days,
        })
        .then((res) => {
          this.monthObject = res.data;
          this.month = this.monthObject.yearMonth;
          this.dates = this.monthObject.dates;
          this.days = this.monthObject.days;
        });
    },
    updateTimesheet(type, month) {
      axios
        .patch(`${this.baseUrl}/${type}/${month}`, {
          name: type,
          yearMonth: month,
          dates: this.dates,
          days: this.days,
        })
        .then((res) => {
          this.monthObject = res.data;
          this.month = this.monthObject.yearMonth;
          this.dates = this.monthObject.dates;
          this.days = this.monthObject.days;
        });
    },
    /**
     * Regular days methods
     */
    updateDates(dates) {
      this.prepDays();
      this.countDays(dates);

      // if we have data, then call patch
      if (this.monthObject) {
        this.updateTimesheet(this.type, this.month);
      } else {
        // if not then post
        this.createTimesheet(this.type, this.month);
      }
    },
    prepDays() {
      this.days = {
        sunday: 0,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
      };
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
  },
};
</script>