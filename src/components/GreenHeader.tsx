import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  showBack?: boolean;
  rightEl?: React.ReactNode;
}

export default function GreenHeader({ title, showBack = true, rightEl }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-green-500">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <div className="w-8" />
      )}
      <span className="text-white font-semibold text-base">{title}</span>
      {rightEl ?? <div className="w-8" />}
    </div>
  );
}
