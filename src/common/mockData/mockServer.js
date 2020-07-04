// import { Server, Model, Response } from "miragejs";
// import mockQuestions from "./mockQuestions";
// import mockUser from "./mockUser";
// import mockFlattenedSchedule from "./mockFlattenedSchedule";
// import mockFollowCounts from "./mockFollowCounts";

// /**
//  * Creates a Mirage.js mock server that will intercept and respond to any fetch requests
//  * made by the application.
//  * @param {"test" | "development"} options.environment Which environment you're in
//  */
// export default function createMockServer({ environment = "test" } = {}) {
//   return new Server({
//     environment,

//     models: {
//       event: Model,
//       question: Model,
//       followCounts: Model,
//       userFollowedEvents: Model,
//       user: Model,
//       token: Model,
//     },

//     // Defines all server API routes
//     routes() {
//       this.urlPrefix = "https://api.bit.camp";

//       this.get("/events", schema => schema.events.all());
//       this.get("/events/following-count", schema => schema.followCounts.all());
//       this.get("/events/following", schema => schema.userFollowedEvents.all());
//       this.get("/questions", schema => schema.questions.all());
//       this.get("/announce", schema => schema.announcements.all());

//       // TODO: better implement post requests
//       this.post("/login", schema => schema.users.first());
//       this.post("/events/follow:id", () => new Response(204));
//       this.post("/events/unfollow:id", () => new Response(204));
//       this.post("/questions/submit", (schema, request) => {
//         const attrs = JSON.parse(request.requestBody);

//         return schema.questions.create({ attrs });
//       });

//       this.post("/announce/subscribe", (schema, request) => {
//         const { token } = request.requestBody;
//         schema.users.first().update({ notificationToken: token });

//         return new Response(204);
//       });
//     },

//     // Defines all data returned by the routes
//     seeds(server) {
//       server.db.loadData({
//         events: mockFlattenedSchedule,
//         questions: mockQuestions,
//         users: [mockUser],
//         followCounts: mockFollowCounts,
//         userFollowedEvents: mockFlattenedSchedule
//           .map(event => event.id)
//           .filter(() => Math.random() < 0.15),
//       });
//     },
//   });
// }
