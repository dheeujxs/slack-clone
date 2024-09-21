import Quill, { QuillOptions } from "quill"
import {PiTextAa} from 'react-icons/pi'
import {MdSend} from 'react-icons/md'
import "quill/dist/quill.snow.css"
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Button } from "./ui/button"
import { ImageIcon, Smile, XIcon } from "lucide-react"
import { Hint } from "./hint"
import { StringToBoolean } from "class-variance-authority/types"
import { EmojiPopover } from "./emoji-popover"
import { Delta  , Op} from "quill/core"
import { cn } from "@/lib/utils"
import Image from "next/image"


type EditorValue = {
    image: File | null;
    body: String;
}

interface EditorProps {
    variant?: "create"|"update"
    onSubmit: ({image , body}: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innferRef?: MutableRefObject<Quill | null>
}
const Editor = ({
    onCancel,
    onSubmit,
    placeholder="Write something...",
    defaultValue=[],
    innferRef,
    variant = "create",
    disabled  = false
}: EditorProps) => {
    const [text , setText] = useState("")
    const [image , setImage] =  useState<File | null>(null)
    const  [ isToolbarVisible , setIsToolbarVisible] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null);
    const submitRef = useRef(onSubmit);
    const placeholaderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue)
    const disabledRef = useRef(disabled)
    const imageElementRef = useRef<HTMLInputElement>(null);


    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholaderRef.current = placeholder;
        disabledRef.current = disabled;
        defaultValueRef.current = defaultValue;

    })



    useEffect(() => {
        if(!containerRef .current) return;

        const container  = containerRef.current;

        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        );

        const options : QuillOptions =  {
           theme:"snow",
           placeholder: placeholaderRef.current,
           modules:{
            toolbar: [
                ["bold","italic","strike"],
                ["link"],
                [{list: "ordered"}, {list: "bullet"}]
            ],
            keyboard: {
                bindings: {
                    enter: {
                        key: "Enter",
                        handler:() => {
                            return
                        }
                    },
                    shift_enter: {
                        key: "Enter",
                        shiftKey: true,
                        handler: () => {
                            quill.insertText(quill.getSelection()?.index || 0 , "\n")
                        }
                    }
                }
            }
           }
        }

        const quill = new Quill(editorContainer , options)

        quillRef.current = quill;
        quillRef.current.focus()

        if(innferRef){
            innferRef.current = quill
        }

        quill.setContents(defaultValueRef.current)

        setText(quill.getText())

        quill.on(Quill.events.TEXT_CHANGE , () => {
            setText(quill.getText());
        })
        return () => {
            quill.off(Quill.events.TEXT_CHANGE)
            if(container){
              container.innerHTML = "";
            }
            if(quillRef.current){
                quillRef.current = null;
            }
            if(innferRef){
                innferRef.current = null;
            }
        }

    } , [innferRef])

    const toogleToolbar = () => {
        setIsToolbarVisible((current) => !current);
        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar")
            if(toolbarElement){
                toolbarElement.classList.toggle("hidden")
            }
    }
        const onEmojiSelect = (emoji: any) => {
         const   quill = quillRef.current;

         quill?.insertText(quill?.getSelection()?.index|| 0 , emoji.native)

        }
    const isEmpty = text.replace(/<(.|\n)*?>/g , "").trim().length === 0 ;
    return (

        <div className="flex flex-col">
        <input type="file" accept="image/*" ref={imageElementRef} onChange={(event) => setImage(event.target.files![0])} className="hidden"/>
       <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
       <div ref={containerRef } className="h-full ql-custom"/>
       {!!image && (
        <div className="p-2">
            <div className="relative size-[62px] flex items-center justify-center group/image">
            <Hint label="Remove  image">
            <button
            onClick={() => {
                setImage(null);
                imageElementRef.current!.value ="";

            }}
            className="hidden group-hover/image:flex  rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] borde-2 border-white items-center justify-center "
            >
                <XIcon className="size-3.5" />
            </button>
            </Hint>
            <Image
            src={URL.createObjectURL(image)}
            alt="Ulpaoded"
            fill
            className="rounded-xl overflow-hidden border object-cover"
            />

            </div>

        </div>
       )}
       <div className="flex px-2 pb-2 z-[5]">
        <Hint label={isToolbarVisible?"Hide formattiong": "Show formatting"}>
        <Button
        disabled={disabled}
        variant='ghost'
        onClick={toogleToolbar}
        size='iconsSm'
        >
           <PiTextAa className="size-4"/>
        </Button>
        </Hint>
       <EmojiPopover onEmojiSelect={onEmojiSelect}>
        <Button
        disabled={disabled}
        variant='ghost'
        size='iconsSm'
        >
           <Smile className="size-4"/>
        </Button>
       </EmojiPopover>
        {variant === 'create'  && (
        <Hint label="Image">
        <Button
        disabled={disabled}
        variant='ghost'
        onClick={() => imageElementRef.current?.click()}
        size='iconsSm'
        >

           <ImageIcon className="size-4"/>
        </Button>
        </Hint>
        )}
        {variant =="update" && (
            <div className="ml-auto flex items-center gap-x-2">
                   <Button
                disabled={disabled || isEmpty}
                onClick={onCancel}
                size='sm'
                variant='outline'>
                    
                    cancel
                </Button>
                <Button
                variant="outline"
                size='sm'
                onClick={() => {}}
                disabled={disabled || isEmpty}
                className=" bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                >
                    Save
                </Button>
             

            </div>
        )}
        {variant === "create" && (

  
        <Button
        disabled={disabled || isEmpty}
        onClick={() => {
            onSubmit({
                body: JSON.stringify(quillRef.current?.getContents()),
                image,
            })
        }}
        size='iconsSm'
        className={cn(
            "ml-auto" ,
            isEmpty
            ?"bg-white hover:bg-white text-muted-foreground"
            :"bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
            )}>
            <MdSend className="size-4" />
        </Button>
              )}
       </div>
       </div>
       {variant === "create"   && (
       <div className={cn("p-2 text-[10px] text-muted-foreground  flex justify-end opacity-0 trans" ,
        !isEmpty &&"opacity-100"
       )}>
        <p>
            <strong>Shift + Return</strong> to add a new line
        </p>
       </div>
       )}
        </div>

    )
}
export default Editor