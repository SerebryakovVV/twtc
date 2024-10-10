export default function ErrorMessage({msg}:{msg:string}) {
  return (
    <div className="text-red-700 text-sm font-bold">
        {msg}
    </div>
  )
}
