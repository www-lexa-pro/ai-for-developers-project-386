import "@typespec/http";
import "@typespec/openapi";
using TypeSpec.Http;
using TypeSpec.OpenAPI;

@service(#{ title: "Call Calendar" })
namespace CallCalendar;

model Health {
  status: "ok";
}

@route("/api/health")
@get
@operationId("getHealth")
op getHealth(): Health;

model MeetingType {
  id: string;
  name: string;
  description: string;
  durationMinutes: int32;
}

model MeetingTypeNotFound {
  code: "meeting_type_not_found";
  message: string;
}

@route("/api/meeting-types")
@get
@operationId("listMeetingTypes")
op listMeetingTypes(): MeetingType[];

@route("/api/meeting-types/{id}")
@get
@operationId("getMeetingType")
op getMeetingType(@path id: string): MeetingType | {
  @statusCode statusCode: 404;
  @body body: MeetingTypeNotFound;
};
