package main

import (
	"time"
	_ "time/tzdata"
)

var moscow = func() *time.Location {
	location, err := time.LoadLocation("Europe/Moscow")
	if err != nil {
		panic(err)
	}
	return location
}()

type bookingInterval struct{ start, end time.Time }
type scheduleDay struct {
	date   time.Time
	reason string
	slots  []bookingInterval
}

// availableDays computes a single snapshot; its caller supplies time and all bookings.
func availableDays(now time.Time, duration int, bookings []bookingInterval) []scheduleDay {
	today := now.In(moscow)
	tomorrow := time.Date(today.Year(), today.Month(), today.Day()+1, 0, 0, 0, 0, moscow)
	days := make([]scheduleDay, 0, 14)
	for offset := range 14 {
		date := tomorrow.AddDate(0, 0, offset)
		day := scheduleDay{date: date, slots: []bookingInterval{}}
		if date.Weekday() == time.Saturday || date.Weekday() == time.Sunday {
			day.reason = "weekend"
		} else {
			closeAt := date.Add(18 * time.Hour)
			for start := date.Add(9 * time.Hour); !start.Add(time.Duration(duration) * time.Minute).After(closeAt); start = start.Add(30 * time.Minute) {
				end := start.Add(time.Duration(duration) * time.Minute)
				free := true
				for _, booking := range bookings {
					if start.Before(booking.end) && end.After(booking.start) {
						free = false
						break
					}
				}
				if free {
					day.slots = append(day.slots, bookingInterval{start: start, end: end})
				}
			}
			if len(day.slots) == 0 {
				day.reason = "fully_booked"
			}
		}
		days = append(days, day)
	}
	return days
}
