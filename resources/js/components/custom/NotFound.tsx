interface NotFoundProps {
    warning: string;
}

const NotFound = ({
    warning,
}: NotFoundProps) => {
    return (
        <div className="flex min-h-125 flex-col items-center justify-center">
            <p className="mt-36 text-xl text-gray-400 uppercase">
            </p>

            <div className="flex items-center justify-center gap-12">
                <div
                    className="
                flex
                h-52
                w-fit
                max-w-[calc(80vw)]
                flex-col
                items-center
                justify-center
                gap-4
                border-2
                border-dashed
                border-[#3949AB]
                text-[#3949AB]
                transition
                hover:bg-[#3949AB]/5
                hover:scale-[1.02]
                cursor-pointer
            "
                >

                    <div className="text-xl opacity-60 uppercase justify-center items-center flex flex-col gap-8 mx-10">
                        <div>{warning}</div>
                        <div> ＞﹏＜</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { NotFound };