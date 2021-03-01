{-# LANGUAGE     OverloadedStrings       #-}
{-# OPTIONS_GHC -fno-warn-type-defaults  #-}
{-# OPTIONS_GHC -fno-warn-name-shadowing #-}


module Svg where

import Text.Blaze.Svg11 ((!))
import Text.Blaze.Svg11 as S
import Text.Blaze.Svg11.Attributes as A
import Text.Blaze.Svg.Renderer.String



main :: IO ()
main = compileSvg

compileSvg :: IO ()
compileSvg =
    mapM_ f allSvg
  where
    f (fileName , svgCode) =
      writeFile ("../assets/img/" ++ fileName) (renderSvg $ docTypeSvg svgCode)


allSvg :: [ (FilePath , Svg) ]
allSvg =
  [ (,) "trivialMosaic.svg" trivialGamePiece
  ]



trivialGamePiece :: Svg
trivialGamePiece =
  svg
    ! A.viewbox "0 0 1 2"
    ! A.preserveaspectratio "xMinYMin meet"
    ! A.stroke "rgb(35,35,35)"
    $ do
      quesitoVerde
      quesitoAmarillo
      quesitoNaranja
      quesitoRosa
      quesitoAzul
      quesitoMorado
      g (quesitoVerde >> quesitoAmarillo >> quesitoNaranja)
        ! A.transform (translate   0.5  1 <> matrix (-1) 0 0 1 1 0)
      g (quesitoRosa >> quesitoAzul >> quesitoMorado)
        ! A.transform (translate (-0.5) 1 <> matrix (-1) 0 0 1 1 0)
  where
    color = "indigo"
    s = 0.02 :: Float
    r = 0.3  :: Float
    sin60 = sin $ pi / 3
    cos60 = cos $ pi / 3
    --------------------------------------------------
    quesitoVerde = 
      quesito ! A.fill "rgb(76, 174, 67)"  ! A.transform (rotateAround 0   0.5 0.5)
    quesitoAmarillo =
      quesito ! A.fill "rgb(255, 222, 0)"  ! A.transform (rotateAround 60  0.5 0.5)
    quesitoNaranja =
      quesito ! A.fill "rgb(248, 152, 41)" ! A.transform (rotateAround 120 0.5 0.5)
    quesitoRosa =
      quesito ! A.fill "rgb(216, 12, 140)" ! A.transform (rotateAround 180 0.5 0.5)
    quesitoAzul =
      quesito ! A.fill "rgb(3, 151, 214)"  ! A.transform (rotateAround 240 0.5 0.5)
    quesitoMorado =
      quesito ! A.fill "rgb(136, 63, 152)" ! A.transform (rotateAround 300 0.5 0.5)
    --------------------------------------------------
    quesito =
      S.path
        ! A.strokeWidth   (S.toValue $ 2*s)
        ! A.d quesitoDirs
    quesitoDirs =
      mkPath $ do
        m   (0.5)  (0.5)
        l   (0.5)  (0.5 - r)
        aa  r r 0 False True (0.5 + r * sin60) (0.5 - r * cos60)
        S.z
    --------------------------------------------------