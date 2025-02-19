import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CardContent,
  Card,
  IconButton,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Event } from "../../models/Models";
import { useAuth } from "../../store/AuthContext";
import axiosClient from "../../utils/axiosClient";

const EventScheduler: React.FC = () => {
  const { userId, username, role } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventData, setEventData] = useState<{
    title: string;
    description: string;
  }>({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosClient.get("/api/events"); // Use axiosClient
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };


  const organizer = {
    id: userId,
    username: username,
    password: "abcd",
    role: role,
  };

  const handleSaveEvent = async () => {
    if (!selectedDate || eventData.title.trim() === "") return;

    const newEvent = {
      title: eventData.title,
      description: eventData.description,
      date: selectedDate.toISOString().split("T")[0],
      organizer: organizer,
    };

    try {
      if (editingEvent) {
        // Update existing event
        await axiosClient.put(`/api/events/${editingEvent.id}`, newEvent);
      } else {
        // Add new event
        await axiosClient.post("/api/events", newEvent);
      }
      fetchEvents();
      setOpen(false);
      setEditingEvent(null);
      setEventData({ title: "", description: "" });
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventData({ title: event.title, description: event.description });
    setSelectedDate(new Date(event.date));
    setOpen(true);
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await axiosClient.delete(`/api/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Event Scheduler</h2>
      <Calendar
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
        tileContent={({ date }) => {
          const event = events.find(
            (e) => new Date(e.date).toDateString() === date.toDateString()
          );
          return event ? <span className="text-red-500">•</span> : null;
        }}
      />

      <Button className="mt-4" onClick={() => setOpen(true)}>
        Add Event
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "500px",
            gap: "20px",
          }}
        >
          <TextField
            label="Title"
            fullWidth
            value={eventData.title}
            onChange={(e) =>
              setEventData({ ...eventData, title: e.target.value })
            }
            margin="dense"
          />
          <TextField
            label="Description"
            fullWidth
            value={eventData.description}
            onChange={(e) =>
              setEventData({ ...eventData, description: e.target.value })
            }
            margin="dense"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEvent}>
            {editingEvent ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <div
        className="mt-4 w-full max-w-lg"
        style={{ overflow: "auto", maxHeight: "calc(-500px + 100vh)" }}
      >
        {events.map((event) => (
          <Card key={event.id} className="mb-2" sx={{ mt: "10px", mb: "10px" }}>
            <CardContent>
              <h3 className="font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toDateString()}
              </p>
              <IconButton onClick={() => handleEditEvent(event)}>
                <EditIcon color="primary" />
              </IconButton>
              <IconButton onClick={() => handleDeleteEvent(event.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventScheduler;
