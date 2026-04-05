const models = ["OpenAI GPT", "Claude", "Gemini", "Grok", "Mistral", "DALL·E"];

const LandingLogos = () => (
  <section className="py-10 border-y border-border/30">
    <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 text-muted-foreground/50">
      {models.map((name) => (
        <span key={name} className="text-xs font-medium tracking-widest uppercase hover:text-muted-foreground transition-colors">
          {name}
        </span>
      ))}
    </div>
  </section>
);

export default LandingLogos;
