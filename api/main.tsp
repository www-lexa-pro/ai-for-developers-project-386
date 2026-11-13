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
