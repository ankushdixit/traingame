import StationSelectForm from "@/components/StationSelectForm";

/**
 * Home Page - Station Selection Screen
 *
 * Entry point for the Mumbai Local Train Game where players
 * select their boarding station and destination.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-center">
          Mumbai Local Train Game
        </h1>

        <div className="w-full max-w-sm">
          <StationSelectForm />
        </div>
      </div>
    </main>
  );
}
