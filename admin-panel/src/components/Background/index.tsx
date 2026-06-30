export default function Background() {
  return (
    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
      <img
        src="/white-background.png"
        alt="Background"
        className="w-full h-full object-cover dark:opacity-25 dark:invert"
      />
    </div>
  );
};