import fitz  # PyMuPDF

def unir_con_ajustes(input_path, output_path, recortes_config):
    """
    Une páginas permitiendo recortar márgenes superior/inferior por separado para cada página.
    Esto permite 'compactar' el diseño verticalmente.
    """
    try:
        doc = fitz.open(input_path)
    except Exception as e:
        print(f"Error: {e}")
        return

    # 1. Calcular altura total basada en los recortes
    total_height = 0
    max_width = 0
    
    # Pre-cálculo de dimensiones
    page_metrics = []
    
    for page in doc:
        p_num = page.number
        rect = page.rect
        
        # Obtener configuración de recorte para esta página (o usar 0 por defecto)
        # config es: (recorte_arriba, recorte_abajo, recorte_lados)
        ajustes = recortes_config.get(p_num, (0, 0, 0)) 
        cut_top, cut_bottom, cut_sides = ajustes
        
        # Calcular altura efectiva (Alto original - lo que cortamos arriba y abajo)
        eff_height = rect.height - cut_top - cut_bottom
        eff_width = rect.width - (cut_sides * 2)
        
        if eff_width > max_width:
            max_width = eff_width
            
        total_height += eff_height
        
        # Guardamos métricas para usarlas luego
        page_metrics.append({
            "eff_height": eff_height,
            "cut_top": cut_top,
            "cut_bottom": cut_bottom,
            "cut_sides": cut_sides,
            "orig_rect": rect
        })

    # 2. Crear lienzo
    out_doc = fitz.open()
    target_page = out_doc.new_page(width=max_width, height=total_height)
    
    current_y = 0
    
    # 3. Estampar contenido recortado
    for page, metrics in zip(doc, page_metrics):
        
        # A. Definir qué trozo de la página original queremos (Clip)
        clip_rect = fitz.Rect(
            metrics["cut_sides"],                        # x0
            metrics["cut_top"],                          # y0 (Cortar encabezado)
            metrics["orig_rect"].width - metrics["cut_sides"], # x1
            metrics["orig_rect"].height - metrics["cut_bottom"] # y1 (Cortar pie)
        )
        
        # B. Definir dónde cae en la página larga (Target)
        target_rect = fitz.Rect(
            0,
            current_y,
            max_width, # Asumimos que centramos o estiramos al ancho
            current_y + metrics["eff_height"]
        )
        
        # C. Estampar
        target_page.show_pdf_page(
            target_rect,
            doc,
            page.number,
            clip=clip_rect
        )
        
        # D. Mover Links (Matemática de coordenadas)
        links = page.get_links()
        for link in links:
            l_rect = link["from"]
            
            # Ajustar coordenadas:
            # 1. Restar el recorte superior (porque el link "sube" al quitar el borde de arriba)
            # 2. Restar el recorte lateral
            # 3. Sumar la posición actual en la página larga
            new_y0 = l_rect.y0 - metrics["cut_top"] + current_y
            new_y1 = l_rect.y1 - metrics["cut_top"] + current_y
            new_x0 = l_rect.x0 - metrics["cut_sides"]
            new_x1 = l_rect.x1 - metrics["cut_sides"]
            
            new_link_rect = fitz.Rect(new_x0, new_y0, new_x1, new_y1)
            
            # Insertar link solo si cae dentro del área visible del clip
            # (Es decir, que no hayamos cortado el trozo de hoja donde estaba el link)
            is_visible = (l_rect.y0 >= metrics["cut_top"] and 
                          l_rect.y1 <= (metrics["orig_rect"].height - metrics["cut_bottom"]))
            
            if is_visible:
                if link["kind"] == fitz.LINK_URI:
                    target_page.insert_link({
                        "kind": fitz.LINK_URI,
                        "from": new_link_rect,
                        "uri": link["uri"]
                    })
        
        current_y += metrics["eff_height"]

    out_doc.ez_save(output_path)
    print(f"✅ PDF Compactado generado: {output_path}")

if __name__ == "__main__":
    archivo_entrada = "Invitación Naty y Carlos.pdf"
    archivo_salida = "Invitación_Compacta.pdf"
    
    # === ZONA DE EDICIÓN ===
    # Formato: { Numero_Pagina: (Recorte_Arriba, Recorte_Abajo, Recorte_Lados) }
    # Las páginas empiezan en 0. (Pagina 1 del PDF es 0)
    # AJUSTA ESTOS VALORES PROBANDO:
    
    CONFIGURACION = {
        0: (0, 100, 0),   # Pag 1: Quitamos 100px de abajo (para acercar "Nuestro día" a la pág 2)
        1: (80, 80, 0),   # Pag 2: Quitamos 80px de arriba (título repetido?) y 80 de abajo
        2: (50, 50, 0),   # Pag 3: Quitamos un poco de márgenes
        3: (50, 0, 0)     # Pag 4: Quitamos margen superior
    }
    
    unir_con_ajustes(archivo_entrada, archivo_salida, CONFIGURACION)
